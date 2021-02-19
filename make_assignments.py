"""
Pyautogui script to make a bunch of assignments in a classroom for testing.

Works on my 13" macbook pro with the browser in fullscreen. Mileage may vary;
most will at least need to adjust the constant points for where those buttons
are on your screen.
"""
from time import sleep
import random

import pyautogui as pg          # type: ignore
from pyautogui import Point     # type: ignore

# button position constants
B_POS = {
    'start': Point(x=406, y=186),
    'dropdown': Point(x=451, y=249),
    # type assgt name here
    'topic_dropdown': Point(x=1207, y=499),
    'append_first_topic': Point(x=1191, y=603),
    'create_new_topic': Point(x=1185, y=539),
    'submit': Point(x=1322, y=113)
}

pg.PAUSE = 0.5

def make_assgt(*, make_topic: bool, topic_name="Default Topic Name") -> None:
    pg.click(B_POS['start'])
    pg.click(B_POS['dropdown'])
    sleep(0.5)
    pg.typewrite('Assignment')
    pg.click(B_POS['topic_dropdown'])
    if make_topic:
        pg.click(B_POS['create_new_topic'])
        pg.typewrite(topic_name)
    else:
        pg.click(B_POS['append_first_topic'])
    pg.click(B_POS['submit'])

if __name__ == '__main__':
    pg.click(B_POS['start'])
    for i in range(45, 0, -1):
        if i % 2 == 0:
            make_assgt(
                make_topic=True,
                topic_name=f'Assignment {i}'
            )
        else:
            make_assgt(make_topic=False)
        sleep(5)
