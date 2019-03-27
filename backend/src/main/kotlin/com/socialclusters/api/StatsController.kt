package com.socialclusters.api

import com.socialclusters.pojos.ModelStatus
import com.socialclusters.services.StatsService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class StatsController(
  val statsService: StatsService
) {
  @GetMapping("/stats/day/topic")
  fun getWeekData(
    @RequestParam(value = "from", defaultValue = "") from: String,
    @RequestParam(value = "to", defaultValue = "") to: String
  ) = statsService.getDayCounts(from, to)

  @GetMapping("/stats/withoutTopic")
  fun getWithoutTopicCount(): Int {
    return statsService.getWithoutTopicCount()
  }

  @GetMapping("/stats/withSuggestedTopic")
  fun getWithSuggestedTopicCount(): Int {
    return 42
  }

  @GetMapping("/stats/modelStatus")
  fun getModelStatus(): ModelStatus {
    return ModelStatus("training", "1547412168")
  }


}
