export const hookReportSchema = {
  "properties": {
    "run": {
      "properties": {
        "runId": {},
        "createdAt": {},
        "meta": {
          "properties": {
            "ciBuildId": {},
            "projectId": {},
            "commit": {
              "properties": {
                "sha": {},
                "branch": {},
                "remoteOrigin": {},
                "message": {},
                "authorEmail": {},
                "authorName": {}
              }
            }
          }
        },
        "specs": {
          "items": {
            "anyOf": [{
              "properties": {
                "spec": {},
                "instanceId": {},
                "claimed": {},
                "claimedAt": {},
                "results": {
                  "properties": {
                    "cypressConfig": {
                      "properties": {
                        "video": {},
                        "videoUploadOnPasses": {}
                      }
                    },
                    "videoUrl": {},
                    "tests": {
                      "items": {
                        "anyOf": [{
                          "properties": {
                            "title": {
                              "items": {
                                "anyOf": [{}]
                              }
                            },
                            "state": {},
                            "wallClockDuration": {},
                            "wallClockStartedAt": {}
                          }
                        }]
                      }
                    },
                    "stats": {
                      "properties": {
                        "tests": {},
                        "pending": {},
                        "passes": {},
                        "failures": {},
                        "skipped": {},
                        "suites": {},
                        "wallClockDuration": {},
                        "wallClockStartedAt": {},
                        "wallClockEndedAt": {}
                      }
                    }
                  }
                }
              }
            }]
          }
        }
      }
    },
    "instance": {
      "properties": {
        "instanceId": {},
        "runId": {},
        "spec": {},
        "run": {
          "properties": {
            "meta": {
              "properties": {
                "ciBuildId": {},
                "projectId": {},
                "commit": {
                  "properties": {
                    "sha": {},
                    "branch": {},
                    "authorName": {},
                    "authorEmail": {},
                    "remoteOrigin": {},
                    "message": {}
                  }
                }
              }
            }
          }
        },
        "results": {
          "properties": {
            "stats": {
              "properties": {
                "suites": {},
                "tests": {},
                "passes": {},
                "pending": {},
                "skipped": {},
                "failures": {},
                "wallClockDuration": {},
                "wallClockStartedAt": {},
                "wallClockEndedAt": {},
                "__typename": {}
              }
            },
            "screenshots": {
              "items": {
                "anyOf": [{
                  "properties": {
                    "testId": {},
                    "screenshotId": {},
                    "height": {},
                    "width": {},
                    "screenshotURL": {}
                  }
                }]
              }
            },
            "videoUrl": {}
          }
        }
      }
    },
    "reportUrl": {},
    "hookEvent": {},
    "currentResults": {}
  }
}