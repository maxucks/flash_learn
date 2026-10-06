def score_change(score, overall_score):
    delta = score - overall_score
    if delta > 0:
        speed = (100 - overall_score) / 100
    else:
        speed = overall_score / 100
    return int(delta * speed)


for score in range(10, 101, 5):
    overall_score = 20
    dx = score_change(score, overall_score)
    print(f"{overall_score} -> {score}: {overall_score + dx} ({dx})")
