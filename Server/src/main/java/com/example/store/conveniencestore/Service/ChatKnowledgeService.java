
package com.example.store.conveniencestore.Service;

import com.example.store.conveniencestore.DTO.KnowledgeTermService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ChatKnowledgeService {

    private final ObjectMapper objectMapper;

    private List<KnowledgeTermService> articles = List.of();

    private static final Pattern DIACRITICS =
            Pattern.compile("\\p{M}+");

    @PostConstruct
    public void loadKnowledge() {

        ClassPathResource resource =
                new ClassPathResource("data/information.json");

        try (InputStream stream = resource.getInputStream()) {

            articles = List.copyOf(
                    objectMapper.readValue(
                            stream,
                            new TypeReference<List<KnowledgeTermService>>() {}
                    )
            );

        } catch (IOException e) {
            throw new IllegalStateException(
                    "Unable to load chatbot knowledge", e
            );
        }
    }

    public Optional<KnowledgeTermService> findArticle(
            String type,
            String keyword
    ) {
        if (type == null || keyword == null
                || keyword.isBlank()) {
            return Optional.empty();
        }

        String normalizedKeyword = normalize(keyword);

        return articles.stream()
                .filter(article ->
                        type.equals(article.type())
                )
                .filter(article ->
                        matches(article, normalizedKeyword)
                )
                .findFirst();
    }

    private boolean matches(
            KnowledgeTermService article,
            String keyword
    ) {
        if (normalize(article.topic()).equals(keyword)) {
            return true;
        }

        if (article.aliases() == null) {
            return false;
        }

        return article.aliases().stream()
                .filter(alias -> alias != null)
                .anyMatch(alias ->
                        normalize(alias).equals(keyword)
                );
    }

    private String normalize(String text) {

        String value = text
                .trim()
                .toLowerCase(Locale.ROOT)
                .replace('đ', 'd');

        return DIACRITICS.matcher(
                        Normalizer.normalize(
                                value,
                                Normalizer.Form.NFD
                        )
                )
                .replaceAll("")
                .replaceAll("\\s+", " ");
    }
}
