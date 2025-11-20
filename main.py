import pygame
import sys
import random
import matplotlib.pyplot as plt

pygame.init()

class Snake:

    def __init__(self):
        self.body = [(7, 5), (6, 5), (5, 5)]
        self.direction = (0, 0)
        self.apple = self._apple_position()
        self.all_direction = {
            "right" : (1, 0),
            "left" : (-1, 0),
            "up" : (0, -1),
            "down" : (0, 1),
            "center" : (0, 0)
        }
        

    def move(self):
        if not self.direction == (0, 0):
            head = self.body[0]
            new_head = (head[0] + self.direction[0], head[1] + self.direction[1])
            self.body.insert(0, new_head)
            self.body.pop()
        
        

    def _apple_position(self):
        while True:
            x = random.randrange(1, x_case - 2)
            y = random.randrange(1, x_case - 2)
            if (x, y) not in self.body:
                break
        return (x, y)
    
    def show_plt_result(self):
       import matplotlib.pyplot as plt

with open('resultat.txt', 'r+') as file:
    parts = []
    scores = []

    for line in file.readlines():
        parts.append(int(line.split(';')[1].split(':')[1].strip()))
        scores.append(int(line.split(';')[0].split(':')[1].strip()))

    # retirer doublons + trier
    parts_unique = sorted(set(parts))
    scores_unique = sorted(set(scores))

    # vérifier tailles avant plot
    min_len = min(len(parts_unique), len(scores_unique))

    parts_unique = parts_unique[:min_len]
    scores_unique = scores_unique[:min_len]

    plt.plot(parts_unique, scores_unique)
    plt.xlabel("parties")
    plt.ylabel("scores")
    plt.savefig("graph.png")
    plt.show()

           
    def save_best_score(self):
        with open('resultat.txt', 'r+') as file:
            parts = []
            for line in file.readlines():
                parts.append(int(line.split(sep=';')[1].split(sep=':')[1].strip()))
        
            file.write(f'score : {score}; part : {len(parts)}\n')


W, H = 600, 600
size_case = 40

x_case, y_case = W // size_case, H // size_case
timer, fps = pygame.time.Clock(), 10

score = 0

screen = pygame.display.set_mode((W, H))
running = True

snake = Snake()

while True:

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
            snake.save_best_score()
            sys.exit()

    screen.fill([0, 0, 0])

    for x in range(x_case):
        for y in range(y_case):
            pygame.draw.rect(screen, [107, 107, 107], [x * size_case, y * size_case, size_case, size_case])

    pygame.draw.rect(screen, [53, 53, 53], [0, 0, W, H], size_case) # dessiner la grille

    food_rect = pygame.Rect(snake.apple[0] * size_case, snake.apple[1] * size_case, size_case, size_case)
    pygame.draw.rect(screen, [123, 12, 34], food_rect)

    for block in snake.body: # dessiner le snake
        pygame.draw.rect(screen, [34, 46, 200], [block[0] * size_case, block[1] * size_case, size_case, size_case])

    head_snake = snake.body[0]
    head_rect = pygame.Rect(head_snake[0] * size_case, head_snake[1] * size_case, size_case, size_case)
    pygame.draw.rect(screen, [0, 0, 255], head_rect)
 
    if head_snake[0] not in list(range(1, x_case - 1)) or head_snake[1] not in list(range(1, y_case - 1)):
        snake.body = [(7, 5), (6, 5), (5, 5)]
        snake.direction = snake.all_direction['center']
        score = 0
        snake.save_best_score()
        snake.show_plt_result()
        snake.apple = snake._apple_position()
        

    if pygame.Rect.colliderect(food_rect, head_rect):
        snake.body.append(snake.apple)
        snake.apple = snake._apple_position()
        score += 1
        

    font = pygame.font.Font(None, 30).render(f"score : {score}", True, [255, 255, 255])
    screen.blit(font, [10, 10])

    key = pygame.key.get_pressed()
    if key[pygame.K_RIGHT]:
        snake.direction = snake.all_direction['right']
    if key[pygame.K_LEFT]:
        snake.direction = snake.all_direction['left']
    if key[pygame.K_UP]:
        snake.direction = snake.all_direction['up']
    if key[pygame.K_DOWN]:
        snake.direction = snake.all_direction['down']
    if key[pygame.K_SPACE]:
        snake.direction = snake.all_direction['center']
    
    snake.move()

    pygame.display.flip()
    pygame.display.update()
    timer.tick(fps)