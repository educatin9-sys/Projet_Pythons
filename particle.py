import pygame


class Particle:
    def __init__(self, x, y, vx, vy, life, color):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.life = life
        self.color = color

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.vy += 0.15
        self.life -= 1

    def draw(self, surface):
        if self.life > 0:
            alpha = max(0, min(255, int(255 * (self.life / 30))))
            surf = pygame.Surface((4, 4), pygame.SRCALPHA)
            surf.fill((*self.color, alpha))
            surface.blit(surf, (int(self.x), int(self.y)))
