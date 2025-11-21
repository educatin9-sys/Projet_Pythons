import pygame
import setting
from menu import Menu
from snake import Snake
import sys

pygame.init()


class Game:

    def __init__(self):
        
        self.size_screen = (750, 500)
        self.timer, self.fps = pygame.time.Clock(), 10
        self.size_case = 30

        self.nb_casex, self.nb_casey = self.size_screen[0] // self.size_case, self.size_screen[1] // self.size_case

        self.screen = pygame.display.set_mode(self.size_screen)
        self.running = True

        menu = Menu(screen=self.screen)
        menu.run_game()

        self.snake = Snake(self.nb_casex, self.nb_casey)


    def get_event_game(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_a:
                    self.snake.is_rect = not self.snake.is_rect

    def update_game(self):
        self.screen.fill(setting.colors['background'])

        for x in range(self.nb_casex):
            for y in range(self.nb_casey):
                new_x, new_y = x * self.size_case, y * self.size_case
                pygame.draw.rect(self.screen, setting.colors['bouton_off'], [new_x, new_y, self.size_case, self.size_case])

        for block in self.snake.body:
            if self.snake.is_rect:
                pygame.draw.rect(self.screen, setting.colors['body'], [block[0] * self.size_case, block[1] * self.size_case, self.size_case, self.size_case], self.size_case)

            else:
                pygame.draw.circle(self.screen, setting.colors['body'], [block[0] * self.size_case + self.size_case // 2, block[1] * self.size_case + self.size_case // 2], self.size_case * 0.50)

        head_snake = self.snake.body[0]
        food_snake = self.snake.apple
        food_rect = pygame.Rect(food_snake[0] * self.size_case, food_snake[1] * self.size_case, self.size_case, self.size_case)
        head_rect= pygame.Rect(head_snake[0] * self.size_case, head_snake[1] * self.size_case, self.size_case, self.size_case)

        if self.snake.is_rect:

            pygame.draw.rect(self.screen, setting.colors["head"], head_rect)
            pygame.draw.rect(self.screen, self.snake.apple_color, food_rect)

        else:
            pygame.draw.circle(self.screen, setting.colors['head'], [head_snake[0] * self.size_case + self.size_case // 2, head_snake[1] * self.size_case + self.size_case // 2], self.size_case * 0.50)
            pygame.draw.circle(self.screen, self.snake.apple_color, [food_snake[0] * self.size_case + self.size_case // 2, food_snake[1] * self.size_case + self.size_case // 2], self.size_case * 0.50)
            


        pygame.draw.rect(self.screen, setting.colors['background'], [0, 0, self.size_screen[0], self.size_screen[1]], 30)

        if head_rect.colliderect(food_rect):
            self.snake.apple  = self.snake.respawn_apple()
            self.snake.body.append(self.snake.apple)

        if head_snake[0] not in range(1, self.nb_casex-1) or head_snake[1] not in range(1, self.nb_casey-1):
            self.snake.origin_body()
            self.snake.apple = self.snake.respawn_apple()
            self.snake.direction = (0, 0)

        
        key = pygame.key.get_pressed()

        # haut
        if key[pygame.K_UP] and self.snake.direction != (0, -1):
            self.snake.set_direction(self.snake.directions['up'])

        # bas
        if key[pygame.K_DOWN] and self.snake.direction != (0, 1):
            self.snake.set_direction(self.snake.directions['down'])

        # gauche
        if key[pygame.K_LEFT] and self.snake.direction != (1, 0):
            self.snake.set_direction(self.snake.directions['left'])

        # droite
        if key[pygame.K_RIGHT] and self.snake.direction != (1, 0):
            self.snake.set_direction(self.snake.directions['right'])

        if key[pygame.K_t] and self.snake.direction != (0, 1):
            self.snake.set_direction(self.snake.directions['stop'])

        self.snake.move()

        pygame.display.flip()
        pygame.display.update()

        self.timer.tick(self.fps)

    def run_game(self):
        while self.running:

            self.get_event_game() # detecte les evement du jeu

            self.update_game() # met a jour le jeu

game = Game()
game.run_game()