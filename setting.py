import pygame
import json
from pathlib import Path

# Fichier de stockage des réglages
SETTINGS_FILE = Path(__file__).parent / "settings.json"

theme = "rgb()"


colors = {
    'barrier': (43, 9, 49),
    'background' : (255,165,0),
    'body' : (255, 238, 84),
    'head' : (82, 23, 5),
    'bg' : (105,105,105),
    'theme' : (155, 240, 0),
    'bouton_on':  (160, 49, 16),
    'bouton_off':  (14, 100, 11),
    'food': [(35, 92, 146), (35, 146, 50), (146, 79, 35), (146, 42, 35)]
}

theme = "rgb(21, 8, 24)"



color = {
    "barrier": (43, 9, 49),
    "bouton_varrier" : (21, 8, 24),
    "background" : [(255, 94, 0), (172, 243, 58), (31, 92, 69), (92, 68, 31)],
    "food" : [(0, 255, 0), (0, 0, 255), (255, 255, 0), (0, 0, 255,), (0, 255, 255)],
    "bouton_on" : (18, 58, 190),
    "bouton_off" : (21, 69, 224),
    "body" : (172, 243, 58),
    "head" : (255, 0, 0)
}


# Réglages persistants (volume en %, theme_index référence l'index dans color['background'], best_score entier)
settings = {
    "volume": 0,
    "theme_index": 0,
    "best_score": 0,
    "scores": [],
    "ai": False
}


def load_settings():
    try:
        if SETTINGS_FILE.exists():
            with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                # merge defaults
                settings.update({k: data.get(k, v) for k, v in settings.items()})
        else:
            save_settings()
    except Exception:
        # si problème de lecture, réécrire les paramètres par défaut
        save_settings()


def save_settings():
    try:
        with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(settings, f, ensure_ascii=False, indent=2)
    except Exception:
        pass


def get_background_color():
    bg_list = color.get("background")
    if isinstance(bg_list, list) and bg_list:
        idx = int(settings.get("theme_index", 0)) % len(bg_list)
        return bg_list[idx]
    # fallback
    return bg_list if isinstance(bg_list, tuple) else (0, 0, 0)


def cycle_theme(next=True):
    bg_list = color.get("background")
    if not isinstance(bg_list, list) or not bg_list:
        return
    length = len(bg_list)
    idx = int(settings.get("theme_index", 0))
    idx = (idx + 1) % length if next else (idx - 1) % length
    settings["theme_index"] = idx
    save_settings()


def set_volume(value: int):
    settings["volume"] = max(0, min(200, int(value)))
    save_settings()


def set_best_score(value: int):
    settings["best_score"] = int(value)
    save_settings()


def append_score(value: int):
    try:
        settings.setdefault('scores', [])
        settings['scores'].append(int(value))
        # keep last 100 scores
        if len(settings['scores']) > 100:
            settings['scores'] = settings['scores'][-100:]
        # update best
        if int(value) > settings.get('best_score', 0):
            settings['best_score'] = int(value)
        save_settings()
    except Exception:
        pass


def get_scores():
    return list(settings.get('scores', []))


def toggle_ai():
    settings['ai'] = not bool(settings.get('ai', False))
    save_settings()


def is_ai_enabled():
    return bool(settings.get('ai', False))

def draw_button(
    screen,
    text: str,
    x: int,
    y: int,
    alignment: str,
    bg: tuple,
    text_color: tuple,
    bg_hover: tuple,
    mouse_pos,
    mouse_clicked,
    key_pressed,
    command_left=None,
    command_right=None,
    command_enter=None,
    width=220,
    height=80
):
    # Création du rectangle
    button_rect = pygame.Rect(0, 0, width, height)
    if alignment == "left":
        button_rect.topleft = (x, y)
    elif alignment == "center":
        button_rect.center = (x, y)
    elif alignment == "right":
        button_rect.topright = (x, y)
    else:
        button_rect.topleft = (x, y)  # fallback

    # Hover
    is_hover = button_rect.collidepoint(mouse_pos)
    color = bg_hover if is_hover else bg
    pygame.draw.rect(screen, color, button_rect, border_radius=12)

    # Texte
    if not hasattr(draw_button, "_font"):
        draw_button._font = pygame.font.Font(None, 40)
    text_surface = draw_button._font.render(text, True, text_color)
    text_rect = text_surface.get_rect(center=button_rect.center)
    screen.blit(text_surface, text_rect)

    # Click gauche
    if is_hover and mouse_clicked[0]:
        if command_left:
            if not hasattr(draw_button, "_clicked_left") or not draw_button._clicked_left:
                command_left()
                draw_button._clicked_left = True
    else:
        draw_button._clicked_left = False

    # Click droit
    if is_hover and mouse_clicked[2]:
        if command_right:
            if not hasattr(draw_button, "_clicked_right") or not draw_button._clicked_right:
                command_right()
                draw_button._clicked_right = True
    else:
        draw_button._clicked_right = False

    # Entrée
    if is_hover and key_pressed[pygame.K_RETURN]:
        if command_enter:
            if not hasattr(draw_button, "_clicked_enter") or not draw_button._clicked_enter:
                command_enter()
                draw_button._clicked_enter = True
    else:
        draw_button._clicked_enter = False

    return button_rect