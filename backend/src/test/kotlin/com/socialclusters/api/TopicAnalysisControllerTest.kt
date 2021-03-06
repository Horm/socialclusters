package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.TrainingDao
import com.socialclusters.db.generated.user_database.tables.pojos.Training
import com.socialclusters.utils.getGetRequest
import com.socialclusters.utils.getPostRequest
import io.kotlintest.Description
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.jooq.DSLContext
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers
import org.springframework.test.web.client.response.MockRestResponseCreators
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.web.client.RestTemplate
import java.sql.Timestamp
import java.time.OffsetDateTime

@AutoConfigureMockMvc
@SpringBootTest
class TopicAnalysisControllerTest(
  val mockMvc: MockMvc,
  val trainingDao: TrainingDao,
  val dslContext: DSLContext,
  val restTemplate: RestTemplate,
  val topicAnalysisServiceUrl: String
) : DescribeSpec() {
  override fun beforeTest(description: Description) {
    dslContext.deleteFrom(Tables.TRAINING).execute()
  }

  init {

    val timestamp = Timestamp.from(OffsetDateTime.now().toInstant())
    val firstTraining = Training(1, TOPIC_MODEL_NAME, true, timestamp, timestamp, 32.1.toBigDecimal())
    val secondTraining = Training(2, TOPIC_MODEL_NAME, true, timestamp, timestamp, 42.1.toBigDecimal())
    val thirdTraining = Training(3, TOPIC_MODEL_NAME, false, timestamp, null, null)
    val fourthTraining = Training(4, TOPIC_MODEL_NAME, false, timestamp, null, null)

    describe("/analysis/topic/trainings") {
      context("POST") {
        it("should start new training") {
          trainingDao.insert(Training(1, TOPIC_MODEL_NAME, false, timestamp, null, null))


          val mockServer = MockRestServiceServer.createServer(restTemplate)
          mockServer
            .expect(MockRestRequestMatchers.requestTo("$topicAnalysisServiceUrl/train"))
            .andRespond(MockRestResponseCreators.withSuccess("1", MediaType.TEXT_HTML))


          val request = getPostRequest("/analysis/topic/trainings", getAccessToken(mockMvc))
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.modelId", Matchers.`is`("topic_analysis")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.isDone", Matchers.`is`(false)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.`is`(1)))
        }
      }
    }

    describe("/analysis/topic/accuracy") {
      it("should return accuracy percentage for last trained model and non trained model should be ignored") {
        trainingDao.insert(firstTraining)
        trainingDao.insert(secondTraining)
        trainingDao.insert(thirdTraining)

        val request = getGetRequest("/analysis/topic/accuracy", getAccessToken(mockMvc))
        mockMvc.perform(request)
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
          .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.`is`(42.1)))

      }
    }

    describe("/analysis/topic/trainings/last") {
      it("should return not found for  table without finished models") {
        trainingDao.insert(Training(1, TOPIC_MODEL_NAME, false, timestamp, null, null))

        val request = getGetRequest("/analysis/topic/trainings/last", getAccessToken(mockMvc))
        mockMvc.perform(request)
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)

      }

      it("should return last finished training") {
        trainingDao.insert(firstTraining)
        trainingDao.insert(secondTraining)
        trainingDao.insert(thirdTraining)

        val request = getGetRequest("/analysis/topic/trainings/last", getAccessToken(mockMvc))
        mockMvc.perform(request)
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
          .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.`is`(2)))

      }
    }

    describe("/analysis/topic/trainings/running") {
      it("should return last model in training") {
        trainingDao.insert(firstTraining)
        trainingDao.insert(secondTraining)
        trainingDao.insert(thirdTraining)
        trainingDao.insert(fourthTraining)

        val request = getGetRequest("/analysis/topic/trainings/running", getAccessToken(mockMvc))
        mockMvc.perform(request)
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
          .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.`is`(4)))

      }
      it("should return not found for no training models") {
        trainingDao.insert(firstTraining)
        trainingDao.insert(secondTraining)

        val request = getGetRequest("/analysis/topic/trainings/running", getAccessToken(mockMvc))
        mockMvc.perform(request)
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)

      }
      it("should return not found for training models where is trained after in training") {
        trainingDao.insert(firstTraining)
        trainingDao.insert(Training(2, TOPIC_MODEL_NAME, false, timestamp, null, null))
        trainingDao.insert(Training(3, TOPIC_MODEL_NAME, true, timestamp, timestamp, 42.1.toBigDecimal()))

        val request = getGetRequest("/analysis/topic/trainings/running", getAccessToken(mockMvc))

        mockMvc
          .perform(request)
          .andDo(MockMvcResultHandlers.print())
          .andExpect(MockMvcResultMatchers.status().isNotFound)

      }
    }
  }

  companion object {
    const val TOPIC_MODEL_NAME = "topic_analysis"
  }
}
