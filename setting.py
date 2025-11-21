import pygame


colors = {
    'barrier': (210,105,30),
    'background' : (255,165,0),
    'body' : (38, 185, 129),
    'head' : (82, 23, 5),
    'bg' : (105,105,105),
    'theme' : (155, 240, 0),
    'bouton_on':  (160, 49, 16),
    'bouton_off':  (14, 100, 11),
    'food': [(35, 92, 146), (35, 146, 50), (146, 79, 35), (146, 42, 35)]
}

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
    command
):
    width, height = 220, 80
    button_rect = pygame.Rect(0, 0, width, height)

    # Gestion de l’alignement horizontal
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

    # Dessin
    pygame.draw.rect(screen, color, button_rect, border_radius=12)

    # Texte
    font = pygame.font.Font(None, 40)
    text_surface = font.render(text, True, text_color)
    text_rect = text_surface.get_rect(center=button_rect.center)
    screen.blit(text_surface, text_rect)

    # Click
    if is_hover and mouse_clicked:
        command()

    return button_rect
