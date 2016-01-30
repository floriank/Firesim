# Firesim
https://beier.f4.htw-berlin.de/aufgaben/javascript/

# Notes

1. Uses a canvas to simulate a forest on a pixel grid
2. The grid is populated by actors, each actor can inhabit one cell in the grid at a time. There can be only one actor per grid cell.
    * *Tree*: a tree has an attribute called *Wetness* determining the chance of it being burned by fire
        - a tree can be alive or dead
        - the wetness of the tree diminishes with each adjecent fire per round
    * *Grass*: Grassland which has neither life, nor wetness 
    * *Fire*: Fire spreads throughout trees, but __not the grass__. Fire has a lifetime of the tree it affects and __burn one lifepoint per round__. Fire will try spread each round to neighbouring trees:
        - Fire has __3 lifepoints__
        - neighbouring trees are cell next to the fire cell, being the __8 adjacent fields__
        - after the fire expunged the life of a tree, it leaves a __dead tree__
3. The simluation is round-based, with a velocity property called _v_ that determines the drawing of the grid each _v_th round.
4. The simulation lasts until there is no fire alive anymore
5. The user can set an arbitrary number of fire cells by clicking into the pixel grid as long as the simlation is not running.
