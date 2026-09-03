package com.example.store.conveniencestore.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {
    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);
    @Autowired
    private Cloudinary cloudinary;
    public UploadResult uploadImage(MultipartFile file, String folder) throws IOException {
        try {
            String publicId = generatePublicId(file.getOriginalFilename());
            if (folder != null && !folder.isEmpty()) {
                publicId = folder + "/" + publicId;
            }
            Map<String, Object> options = ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", folder,
                    "resource_type", "image",
                    "quality", "auto:good",
                    "fetch_format", "auto"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            String url = (String) uploadResult.get("secure_url");
            String cloudinaryPublicId = (String) uploadResult.get("public_id");
            Integer bytes = (Integer) uploadResult.get("bytes");

            logger.info("Upload thành công: {} -> {}", file.getOriginalFilename(), url);

            return new UploadResult(cloudinaryPublicId, url, bytes.longValue());

        } catch (Exception e) {
            logger.error("Lỗi upload ảnh: {}", e.getMessage());
            throw new IOException("Upload ảnh thất bại: " + e.getMessage(), e);
        }
    }

    public boolean deleteImage(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");

            boolean deleted = "ok".equals(resultStatus);
            if (deleted) {
                logger.info("Xóa ảnh thành công: {}", publicId);
            } else {
                logger.warn("Không thể xóa ảnh: {} (Status: {})", publicId, resultStatus);
            }

            return deleted;
        } catch (Exception e) {
            logger.error("Lỗi xóa ảnh {}: {}", publicId, e.getMessage());
            return false;
        }
    }
    public String getTransformedUrl(String publicId, int width, int height, String cropMode) {
        try {
            Transformation transformation = new Transformation()
                    .width(width)
                    .height(height)
                    .crop(cropMode != null ? cropMode : "fill")
                    .quality("auto:good");
            return cloudinary.url()
                    .transformation(transformation).secure(true)
                    .generate(publicId);
        } catch (Exception e) {
            logger.error("Lỗi tạo transformed URL: {}", e.getMessage());
            return null;
        }
    }

    public java.util.List<UploadResult> uploadMultipleImages(List<MultipartFile> files, String folder) throws IOException {
        java.util.List<UploadResult> results = new java.util.ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                results.add(uploadImage(file, folder));
            }
        }
        return results;
    }

    private String generatePublicId(String originalFileName) {
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            originalFileName = originalFileName.substring(0, originalFileName.lastIndexOf("."));
        }
        return originalFileName + "_" + UUID.randomUUID().toString().substring(0, 8);
    }


    public static class UploadResult {
        private String publicId;
        private String url;
        private Long fileSize;

        public UploadResult(String publicId, String url, Long fileSize) {
            this.publicId = publicId;
            this.url = url;
            this.fileSize = fileSize;
        }
        public String getPublicId() { return publicId; }
        public String getUrl() { return url; }
        public Long getFileSize() { return fileSize; }
    }

    public String extractPublicIdFromCloudinaryUrl(String urlString) {
        try {
            if (urlString == null || urlString.trim().isEmpty()) {
                return null;
            }
            if (!urlString.contains("res.cloudinary.com")) {
                return null;
            }
            String pattern = ".*/upload/v\\d+/(.+)";
            java.util.regex.Pattern r = java.util.regex.Pattern.compile(pattern);
            java.util.regex.Matcher m = r.matcher(urlString);

            if (m.find()) {
                String publicId = m.group(1);

                int lastDotIndex = publicId.lastIndexOf(".");
                if (lastDotIndex > 0 && lastDotIndex > publicId.lastIndexOf("/")) {
                    publicId = publicId.substring(0, lastDotIndex);
                }

                return publicId;
            }

            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}