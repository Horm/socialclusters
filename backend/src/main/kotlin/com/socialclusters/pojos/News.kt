package com.socialclusters.pojos

import org.springframework.data.annotation.Id

class News(
  @Id
  override var _id: String?,
  val title: String,
  override var text: String,
  override var timestamp: String,
  val url: String,
  val language: String,
  val publisher: Publisher,
  override var topics: List<String>?, // TODO - Better immutable way of document update?
  override var suggestedTopics: List<String>?
) : Post()

data class Publisher(
  val name: String,
  val url: String
)
