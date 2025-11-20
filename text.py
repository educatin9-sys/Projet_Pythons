with open('resultat.txt', 'r') as file:
    parts = []
    scores = []
    for line in file.readlines():
        parts.append(int(line.split(sep=';')[1].split(sep=':')[1].strip()))
        scores.append(int(line.split(sep=';')[0].split(sep=':')[1].strip()))

    parts = list(set(parts)).sort()
    print(parts)

    

