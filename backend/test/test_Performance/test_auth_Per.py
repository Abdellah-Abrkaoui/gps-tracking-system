"""
def test_auth_performance():
    failure = 0
    Time_start = time.time()
    for i in range(10):
        response =  test_auth()
        if response != 200:
            failure += 1
    Time_end = time.time()
    Time_diff = Time_end - Time_start
    print(f"Time taken for 10 requests: {Time_diff} seconds")
    print(f"Number of failures: {failure}")
    assert failure == 0, f"Expected 0 failures, got {failure}"
"""
