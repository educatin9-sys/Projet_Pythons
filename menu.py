import pygame
import setting
import sys

class Menu:

    def __init__(self, screen):
        
        self.size_screen = (750, 500)
        pygame.mixer.music.set_volume(setting.settings.get('volume', 80) / 100)
        self.timer, self.fps = pygame.time.Clock(), 10
        self.size_case = 30

        self.nb_casex, self.nb_casey = self.size_screen[0] // self.size_case, self.size_screen[1] // self.size_case


        self.screen = screen
        self.running = True
        # Charger les réglages persistants au démarrage
        try:
            setting.load_settings()
        except Exception:
            pass

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
        self.screen.fill(setting.get_background_color())

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
        setting.draw_button(
            self.screen,
            "Jouer",
            W // 2,
            H // 2 - 120,
            "center",
            setting.color['bouton_on'],
            (255, 255, 255),
            setting.color['bouton_off'],
            mouse_pos,
            mouse_clicked,
            key_pressed,
            command_left=lambda: self.stop(False),
            command_right=lambda: self.stop(False),
            command_enter=lambda: self.stop(False)
        )

        # Bouton Options
        setting.draw_button(
            self.screen,
            "Options",
            W // 2,
            H // 2,
            "center",
            setting.color['bouton_on'],
            (255, 255, 255),
            setting.color['bouton_off'],
            mouse_pos,
            mouse_clicked,
            key_pressed,
            command_left=lambda: self.show_options(),
            command_right=lambda: self.show_options(),
            command_enter=lambda: self.show_options()
        )

        # Bouton Quitter
        setting.draw_button(
            self.screen,
            "Quitter",
            W // 2,
            H // 2 + 120,
            "center",
            setting.color['bouton_on'],
            (255, 255, 255),
            setting.color['bouton_off'],
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

            pygame.mixer.music.set_volume(setting.settings.get('volume', 80) / 100)

            # récupérer états
            key_pressed = pygame.key.get_pressed()
            mouse_pos = pygame.mouse.get_pos()
            mouse_clicked = pygame.mouse.get_pressed()

            self.screen.fill(setting.get_background_color())
            W, H = self.screen.get_size()

            # Title
            self.screen.blit(
                pygame.font.Font(None, 36).render("Options", True, [255, 255, 255]),
                [W // 2 - 50, 20]
            )

            # helpers pour actions
            def change_volume(delta):
                vol = int(setting.settings.get('volume', 80))
                vol = max(0, min(200, vol + delta))
                setting.set_volume(vol)

            def next_theme():
                setting.cycle_theme(next=True)

            def prev_theme():
                setting.cycle_theme(next=False)

            def reset_best():
                setting.set_best_score(0)

            def exit_options():
                nonlocal options_running
                options_running = False

            # Volume option + / -
            vol = setting.settings.get('volume', 80)
            self.screen.blit(
                pygame.font.Font(None, 24).render(f"Volume: {vol}%", True, [255, 255, 255]),
                [W // 2 - 40, H // 2 - 80]
            )

            setting.draw_button(self.screen, "-", W // 2 - 120, H // 2 - 70, "center",
                                setting.color['bouton_on'], (255, 255, 255), setting.color['bouton_off'],
                                mouse_pos, mouse_clicked, key_pressed,
                                command_left=lambda: change_volume(-10),
                                width=60, height=40)

            setting.draw_button(self.screen, "+", W // 2 + 120, H // 2 - 70, "center",
                                setting.color['bouton_on'], (255, 255, 255), setting.color['bouton_off'],
                                mouse_pos, mouse_clicked, key_pressed,
                                command_left=lambda: change_volume(10),
                                width=60, height=40)

            # Theme option
            theme_idx = int(setting.settings.get('theme_index', 0))
            bg_list = setting.color.get('background')
            theme_count = len(bg_list) if isinstance(bg_list, list) else 1
            self.screen.blit(
                pygame.font.Font(None, 24).render(f"Theme: {theme_idx + 1}/{theme_count}", True, [255, 255, 255]),
                [W // 2 - 40, H // 2]
            )

            setting.draw_button(self.screen, "<", W // 2 - 120, H // 2 + 10, "center",
                                setting.color['bouton_on'], (255, 255, 255), setting.color['bouton_off'],
                                mouse_pos, mouse_clicked, key_pressed,
                                command_left=prev_theme,
                                width=60, height=40)
            setting.draw_button(self.screen, ">", W // 2 + 120, H // 2 + 10, "center",
                                setting.color['bouton_on'], (255, 255, 255), setting.color['bouton_off'],
                                mouse_pos, mouse_clicked, key_pressed,
                                command_left=next_theme,
                                width=60, height=40)

            # AI toggle
            ai_status = "On" if setting.is_ai_enabled() else "Off"
            self.screen.blit(
                pygame.font.Font(None, 22).render(f"AI: {ai_status}", True, [255, 255, 255]),
                [W // 2 - 40, H // 2 + 40]
            )

            setting.draw_button(self.screen, "AI", W // 2 + 120, H // 2 + 80, "center",
                                setting.color['bouton_on'], (255, 255, 255), setting.color['bouton_off'],
                                mouse_pos, mouse_clicked, key_pressed,
                                command_left=setting.toggle_ai,
                                width=80, height=40)

            # Best score
            best = setting.settings.get('best_score', 0)
            self.screen.blit(
                pygame.font.Font(None, 24).render(f"Best Score: {best}", True, [255, 255, 255]),
                [W // 2 - 60, H // 2 + 80]
            )

            setting.draw_button(self.screen, "Reset", W // 2 - 120, H // 2 + 80, "center",
                                setting.color['bouton_on'], (255, 255, 255), setting.color['bouton_off'],
                                mouse_pos, mouse_clicked, key_pressed,
                                command_left=reset_best,
                                width=100, height=40)

            # Back button
            setting.draw_button(self.screen, "Retour", W // 2, H - 80, "center",
                                setting.color['bouton_on'], (255, 255, 255), setting.color['bouton_off'],
                                mouse_pos, mouse_clicked, key_pressed,
                                command_left=exit_options,
                                width=140, height=50)

            # Note: Use ESC pour revenir
            pygame.display.flip()
            self.timer.tick(self.fps)

    def run_game(self):
        while self.running:

            self.get_event_game() # detecte les evement du jeu

            self.update_game() # met a jour le jeu



