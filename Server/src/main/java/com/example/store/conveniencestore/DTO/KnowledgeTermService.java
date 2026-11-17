package com.example.store.conveniencestore.DTO;

import java.util.List;

public record KnowledgeTermService(String type,
                                   String topic,
                                   List<String> aliases,
                                   String answer) {
}
