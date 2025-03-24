import { IDrivingQuiz } from '@revolt-rp/common';


export const dmvConfig = {
  drivingLicenseExpireDays: 62,
  drivingTest: {
    maxMistakes: 3,
    vehicleModel: 'blista',
    vehicleNumberplate: 'DMV',
    vehicleColor: 69
  },
  quiz: {
    maxQuestions: 7,
    questions: [
      {
        question: 'driving_questions.what_is_the_legal_age_for_driving',
        answers: [
          {
            answer: 'driving_questions.18_years_old',
            correct: true
          },
          {
            answer: 'driving_questions.16_years_old'
          },
          {
            answer: 'driving_questions.21_years_old'
          },
          {
            answer: 'driving_questions.14_years_old'
          }
        ]
      },
      {
        question: 'driving_questions.when_should_you_use_your_horn_while_driving',
        answers: [
          {
            answer: 'driving_questions.to_warn_other_drivers_of_your_presence',
            correct: true
          },
          {
            answer: 'driving_questions.to_express_frustration_with_other_drivers'
          },
          {
            answer: 'driving_questions.to_signal_someone_to_move_faster'
          },
          {
            answer: 'driving_questions.when_approaching_a_stop_sign'
          }
        ]
      },
      {
        question: 'driving_questions.what_does_a_flashing_yellow_traffic_light_mean',
        answers: [
          {
            answer: 'driving_questions.proceed_with_caution',
            correct: true
          },
          {
            answer: 'driving_questions.stop_immediately'
          },
          {
            answer: 'driving_questions.go_as_fast_as_possible'
          },
          {
            answer: 'driving_questions.yield_to_pedestrians'
          }
        ]
      },
      {
        question: 'driving_questions.what_is_the_maximum_speed_limit_in_a_residential_area',
        answers: [
          {
            answer: 'driving_questions.30_kmh',
            correct: true
          },
          {
            answer: 'driving_questions.50_kmh'
          },
          {
            answer: 'driving_questions.70_kmh'
          },
          {
            answer: 'driving_questions.90_kmh'
          }
        ]
      },
      {
        question: 'driving_questions.what_is_the_speed_limit_on_highways_in_most_areas',
        answers: [
          {
            answer: 'driving_questions.100_kmh',
            correct: true
          },
          {
            answer: 'driving_questions.120_kmh'
          },
          {
            answer: 'driving_questions.80_kmh'
          },
          {
            answer: 'driving_questions.60_kmh'
          }
        ]
      },
      {
        question: 'driving_questions.what_is_the_speed_limit_in_school_zones',
        answers: [
          {
            answer: 'driving_questions.20_kmh',
            correct: true
          },
          {
            answer: 'driving_questions.30_kmh'
          },
          {
            answer: 'driving_questions.40_kmh'
          },
          {
            answer: 'driving_questions.50_kmh'
          }
        ]
      },
      {
        question: 'driving_questions.why_should_you_always_keep_a_safe_following_distance',
        answers: [
          {
            answer: 'driving_questions.to_avoid_collision',
            correct: true
          },
          {
            answer: 'driving_questions.to_save_fuel'
          },
          {
            answer: 'driving_questions.to_improve_visibility'
          },
          {
            answer: 'driving_questions.to_increase_speed'
          }
        ]
      },
      {
        question: 'driving_questions.what_is_the_maximum_speed_limit_in_tunnels',
        answers: [
          {
            answer: 'driving_questions.80_kmh',
            correct: true
          },
          {
            answer: 'driving_questions.100_kmh'
          },
          {
            answer: 'driving_questions.120_kmh'
          },
          {
            answer: 'driving_questions.60_kmh'
          }
        ]
      },
      {
        question: 'driving_questions.what_should_you_do_if_you_see_a_yield_sign',
        answers: [
          {
            answer: 'driving_questions.slow_down_and_yield_to_other_traffic',
            correct: true
          },
          {
            answer: 'driving_questions.speed_up_to_beat_other_traffic'
          },
          {
            answer: 'driving_questions.stop_immediately'
          },
          {
            answer: 'driving_questions.continue_at_the_same_speed'
          }
        ]
      },
      {
        question: 'driving_questions.what_is_the_speed_limit_in_residential_areas',
        answers: [
          {
            answer: 'driving_questions.30_kmh',
            correct: true
          },
          {
            answer: 'driving_questions.40_kmh'
          },
          {
            answer: 'driving_questions.50_kmh'
          },
          {
            answer: 'driving_questions.60_kmh'
          }
        ]
      }
    ],
    passingScore: 5
  } as IDrivingQuiz
};
