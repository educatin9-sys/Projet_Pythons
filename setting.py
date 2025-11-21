import pygame

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