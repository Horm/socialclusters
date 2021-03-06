package com.socialclusters.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
@EnableWebMvc
class SecurityConfiguration : WebMvcConfigurer {

  override fun addCorsMappings(registry: CorsRegistry?) {
    registry!!.addMapping("/**").allowedOrigins("http://localhost:3000").allowedMethods("GET", "PUT", "POST", "DELETE", "PATCH")
  }
}
