```
Build a 2D low-bit (8- or 16-bit style) platformer game in the browser where players control a customizable character using full-body movements tracked via their webcam.

🕹️ Core Features:

Retro pixel-art platformer gameplay (jumping, running, ducking, etc.)

Character is controlled using body tracking powered by MediaPipe (jumping = jump, lean left is move left, lean right is move right, ducking is ducking)

Customizable characters: let users select or design pixel avatars (skin tone, outfit, hair, etc.)

Run entirely in the browser (client-side), no server required.

Use Polygon blockchain to mint characters

⚙️ Tech Stack Suggestions:

use simple node family framework

MediaPipe / PoseNet for webcam-based pose estimation

p5.js or Phaser for the platformer engine

give it a fun retro terraria / mario look 
```

```
add a button that requests camera access
```

```
show the user camera and mediapipe skeleton on the screen and have a log of all the moves made
```

```
consider this project and how polygon minting of character designs may fit into this
integrate a simple but functional implementation of the minting process where users pay a small amount of gas
```

```
0xCb0d18F697C255bCb029F3950F58A8Dafd91E373
is the deployed address (on polygon amoy testnet), update the game's mint file
```