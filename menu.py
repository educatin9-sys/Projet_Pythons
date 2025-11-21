import pygame
from setting import colors, draw_button, color
import sys

class Menu:

    def __init__(self, screen):
        
        self.size_screen = (750, 500)
        self.timer, self.fps = pygame.time.Clock(), 10
        self.size_case = 30

        self.nb_casex, self.nb_casey = self.size_screen[0] // self.size_case, self.size_screen[1] // self.size_case


        self.screen = screen
        self.running = True

    def stop(self, bool : bool):
        if bool:
            self.running = False
            sys.exit()
            
        self.running = False


    def get_event_game(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
                sys.exit()

    def update_game(self):
        self.screen.fill(color['background'][0])

        key_pressed = pygame.key.get_pressed()
        mouse_pos = pygame.mouse.get_pos()
        mouse_clicked = pygame.mouse.get_pressed()  # on récupère tous les boutons [gauche, milieu, droit]
        W, H = self.screen.get_size()

        # Titre
        self.screen.blit(
            pygame.font.Font(None, 36).render("Snake game", True, [255, 255, 255]),
            [W // 2 - 80, 20]
        )

        # Bouton Jouer
        draw_button(
            self.screen,
            "Jouer",
            W // 2,
            H // 2 - 120,
            "center",
            color['bouton_on'],
            (255, 255, 255),
            color['bouton_off'],
            mouse_pos,
            mouse_clicked,
            key_pressed,
            command_left=lambda: self.stop(False),
            command_right=lambda: self.stop(False),
            command_enter=lambda: self.stop(False)
        )

        # Bouton Options
        draw_button(
            self.screen,
            "Options",
            W // 2,
            H // 2,
            "center",
            color['bouton_on'],
            (255, 255, 255),
            color['bouton_off'],
            mouse_pos,
            mouse_clicked,
            key_pressed,
            command_left=lambda: self.show_options(),
            command_right=lambda: self.show_options(),
            command_enter=lambda: self.show_options()
        )

        # Bouton Quitter
        draw_button(
            self.screen,
            "Quitter",
            W // 2,
            H // 2 + 120,
            "center",
            color['bouton_on'],
            (255, 255, 255),
            color['bouton_off'],
            mouse_pos,
            mouse_clicked,
            key_pressed,
            command_left=lambda: self.stop(True),
            command_right=lambda: self.stop(True),
            command_enter=lambda: self.stop(True)
        )

        pygame.display.flip()
        self.timer.tick(self.fps)

    def show_options(self):
        options_running = True
        while options_running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                    sys.exit()
                if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                    options_running = False

            self.screen.fill(color['background'][0])
            W, H = self.screen.get_size()

            # Title
            self.screen.blit(
                pygame.font.Font(None, 36).render("Options", True, [255, 255, 255]),
                [W // 2 - 50, 20]
            )

            # Volume option
            self.screen.blit(
                pygame.font.Font(None, 24).render("Volume: 80%", True, [255, 255, 255]),
                [W // 2 - 100, H // 2 - 80]
            )

            # Theme option
            self.screen.blit(
                pygame.font.Font(None, 24).render("Theme: Dark", True, [255, 255, 255]),
                [W // 2 - 100, H // 2]
            )

            # Best score option
            self.screen.blit(
                pygame.font.Font(None, 24).render("Best Score: 150", True, [255, 255, 255]),
                [W // 2 - 100, H // 2 + 80]
            )

            pygame.display.flip()
            self.timer.tick(self.fps)

    def run_game(self):
        while self.running:

            self.get_event_game() # detecte les evement du jeu

            self.update_game() # met a jour le jeu



