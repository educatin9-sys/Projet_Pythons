import pygame
import setting
from menu import Menu
from snake import Snake
import sys
import time

pygame.init()
pygame.mixer.init()


class Game:

    def __init__(self):
        
        self.size_screen = (750, 500)
        self.timer, self.fps = pygame.time.Clock(), 10
        self.size_case = 40

        pygame.mixer.music.load("asset/sound.mp3")
        pygame.mixer.music.set_volume(0.5)   # volume entre 0.0 et 1.0
        pygame.mixer.music.play(-1)          # -1 = boucle infinie


        self.sound = pygame.mixer.Sound('asset/game-start.mp3')
        self.sound.set_volume(10)

        self.score = 0

        self.nb_casex, self.nb_casey = self.size_screen[0] // self.size_case, self.size_screen[1] // self.size_case

        self.screen = pygame.display.set_mode(self.size_screen)
        self.running = True

        self.is_grid = True

        self.menu = Menu(screen=self.screen)
        self.menu.run_game()

        self.snake = Snake(self.nb_casex, self.nb_casey)

    def eye_direction_offset(self, direction, intensity=2):
        dx, dy = direction
        return dx * intensity, dy * intensity
    
    def draw_rect_eyes(self, screen, head_pos, size_case, direction, is_rect=True):
        x, y = head_pos
        base_offset = size_case // 6
        look_dx, look_dy = self.eye_direction_offset(self.snake.direction)

        if is_rect:
            pygame.draw.rect(
                screen, (255, 255, 255),
                [x * size_case + base_offset + 3 + look_dx,
                y * size_case + base_offset + look_dy,
                5, 3]
            )
            pygame.draw.rect(
                screen, (255, 255, 255),
                [x * size_case + size_case - base_offset - 5 + look_dx,
                y * size_case + base_offset + look_dy,
                5, 3]
            )

    def draw_round_eyes(self, screen, head_pos, size_case, direction):
        x, y = head_pos
        radius = 2
        look_dx, look_dy = self.eye_direction_offset(direction)

        pygame.draw.circle(
            screen, (255, 255, 255),
            [x * size_case + size_case // 3 + look_dx,
            y * size_case + size_case // 3 + look_dy],
            radius
        )
        pygame.draw.circle(
            screen, (255, 255, 255),
            [x * size_case + size_case * 2 // 3 + look_dx,
            y * size_case + size_case // 3 + look_dy],
            radius
        )

    def draw_snake_eyes(self, screen, snake, head_pos, size_case):
        if self.snake.is_rect:
            self.draw_rect_eyes(screen, head_pos, size_case, snake.direction, True)
        else:
            self.draw_round_eyes(screen, head_pos, size_case, snake.direction)

    def get_event_game(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_a:
                    self.snake.is_rect = not self.snake.is_rect

                if event.key == pygame.K_g:
                    self.is_grid = not self.is_grid

    def update_game(self):
        self.screen.fill(setting.color['background'][2])

        for x in range(self.nb_casex):
            for y in range(self.nb_casey):
                new_x, new_y = x * self.size_case, y * self.size_case
                pygame.draw.rect(self.screen, setting.color['background'][0], [new_x, new_y, self.size_case, self.size_case], width=(0 if self.is_grid else 1))

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

            pygame.draw.rect(self.screen, setting.color["head"], head_rect)
            pygame.draw.rect(self.screen, self.snake.apple_color, food_rect)

        else:
            pygame.draw.circle(self.screen, setting.color['head'], [head_snake[0] * self.size_case + self.size_case // 2, head_snake[1] * self.size_case + self.size_case // 2], self.size_case * 0.50)
            pygame.draw.circle(self.screen, self.snake.apple_color, [food_snake[0] * self.size_case + self.size_case // 2, food_snake[1] * self.size_case + self.size_case // 2], self.size_case * 0.50)
            

        # Draw eyes on snake head
        eye_offset = self.size_case // 6
        eye_radius = 2
        if self.snake.is_rect:
            pygame.draw.rect(self.screen, (255, 255, 255), [head_snake[0] * self.size_case + eye_offset + 3, head_snake[1] * self.size_case + eye_offset, 5, 3], eye_radius)
            pygame.draw.rect(self.screen, (255, 255, 255), [head_snake[0] * self.size_case + self.size_case - eye_offset - 5, head_snake[1] * self.size_case + eye_offset, 5, 3], eye_radius)
        else:
            pygame.draw.circle(self.screen, (255, 255, 255), [head_snake[0] * self.size_case + self.size_case // 3, head_snake[1] * self.size_case + self.size_case // 3], eye_radius)
            pygame.draw.circle(self.screen, (255, 255, 255), [head_snake[0] * self.size_case + self.size_case * 2 // 3, head_snake[1] * self.size_case + self.size_case // 3], eye_radius)

        pygame.draw.rect(self.screen, setting.color['barrier'], [0, 0, self.size_screen[0], self.size_screen[1]], self.size_case)
        self.screen.blit(
            pygame.font.Font(None, 36).render(f"Score : {self.score}", True, [255, 255, 255]), [5, 5]
        )

        self.draw_snake_eyes(self.screen, self.snake, head_snake, self.size_case)

        if head_rect.colliderect(food_rect):
            pygame.mixer.music.set_volume(0.2)
            self.sound.play()
            pygame.mixer.music.set_volume(0.5)
            self.snake.apple  = self.snake.respawn_apple()
            self.snake.body.append(self.snake.apple)
            self.score += 1
            self.snake.is_rect = not self.snake.is_rect

        if head_snake[0] not in range(1, self.nb_casex-1) or head_snake[1] not in range(1, self.nb_casey-1):
            self.menu
            self.snake.origin_body()
            self.snake.apple = self.snake.respawn_apple()
            self.snake.direction = (0, 0)
            self.score = 0


        mouse_pos = pygame.mouse.get_pos()
        mouse_clicked = pygame.mouse.get_pressed()  # récupère tous les boutons [gauche, milieu, droit]
        key_pressed = pygame.key.get_pressed()

        setting.draw_button(
            self.screen,
            "<<:",
            self.size_screen[0] - 80,
            self.size_case - 20,
            "center",
            setting.color['bouton_on'],
            (255, 255, 255),
            setting.color['bouton_off'],
            mouse_pos,
            mouse_clicked,
            key_pressed,
            command_left=lambda: Menu(self.screen).run_game(),
            command_right=lambda: Menu(self.screen).run_game(),
            command_enter=lambda: Menu(self.screen).run_game(),
            width=80,
            height=self.size_case
)

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