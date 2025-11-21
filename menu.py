import pygame
from setting import colors, draw_button
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
        print('ok')


    def get_event_game(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
                sys.exit()

    def update_game(self):
        self.screen.fill(colors['bouton_on'])

        mouse_pos = pygame.mouse.get_pos()
        mouse_clicked = pygame.mouse.get_pressed()[0]
        W, H = self.screen.get_size()

        draw_button(
            self.screen, "Jouer",
            W // 2, H // 2 - 120,  # Position Y ajustée
            "center",
            colors['theme'], (255, 255, 255), (255, 240, 0),
            mouse_pos, mouse_clicked,
            lambda: self.stop(False)
        )

        draw_button(
            self.screen, "Options",
            W // 2, H // 2,
            "center",
            colors['theme'], (255, 255, 255), (255, 240, 0),
            mouse_pos, mouse_clicked,
            lambda: print("Options")
        )

        draw_button(
            self.screen, "Quitter",
            W // 2, H // 2 + 120,
            "center",
            colors['theme'], (255, 255, 255), (255, 240, 0),
            mouse_pos, mouse_clicked,
            lambda: self.stop(True)
        )


       

        pygame.display.flip()
        pygame.display.update()

        self.timer.tick(self.fps)

    def run_game(self):
        while self.running:

            self.get_event_game() # detecte les evement du jeu

            self.update_game() # met a jour le jeu



