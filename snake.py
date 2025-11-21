import setting
import random

class Snake:

    def __init__(self, case_x, case_y):
        self.x, self.y = case_x, case_y
        self.body = [(7, 5), (6, 5), (5, 5)]
        self.is_rect = True

        self.direction = (0, 0)
        self.directions = {
            "right" : (1, 0),
            "left" : (-1, 0),
            "up" : (0, -1),
            "down" : (0, 1),
            "stop" : (0, 0)
            }
        
        self.apple = (random.randrange(1, self.x-2), random.randrange(1, self.y-2))
        self.apple_color = random.choice(setting.colors['food'])

    def origin_body(self):
        self.body = [(7, 5), (6, 5), (5, 5)]

    def set_direction(self, new_direction):
        # direction actuelle
        dx, dy = self.direction
        
        # direction opposée
        opposite = (-dx, -dy)

        # on bloque si new_direction == opposite
        if new_direction != opposite:
            self.direction = new_direction


    def respawn_apple(self):
        while True:
            x, y = random.randrange(1, self.x-2), random.randrange(1, self.y-2)
            if (x, y) not in self.body:
                    self.apple_color = random.choice(setting.colors['food'])
                    break
        return (x, y)
    
    def move(self, wrap: bool = False):
        if self.direction != (0, 0):
            head = self.body[0]
            if wrap:
                new_head = ((head[0] + self.direction[0]) % self.x, (head[1] + self.direction[1]) % self.y)
            else:
                new_head = (head[0] + self.direction[0], head[1] + self.direction[1])

            self.body.insert(0, new_head)
            self.body.pop()