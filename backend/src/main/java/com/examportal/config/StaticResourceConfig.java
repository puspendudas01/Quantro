package com.examportal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Value("${image.storage.path:images}")
    private String storagePath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String path = (storagePath == null || storagePath.isBlank()) ? "images" : storagePath;
        Path p = Path.of(path).toAbsolutePath();
        String resourceLocation = p.toUri().toString();

        // Serve files saved in the configured image storage directory under the URL path /images/**
        registry.addResourceHandler("/images/**")
                .addResourceLocations(resourceLocation)
                .setCachePeriod(3600);
    }
}
