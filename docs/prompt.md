+ many debugging prompts that can be shared upon request but below are the first prompts that introduce new features / start a debug prompt spree

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

```
expand the customisability of a character so people can design their own character bit by bit (it opens a popup where they can select a colour and click squares to check their chatacter) - maintain the low profile of the minting metadata somehow (this can be lossless)
```

```
add a LLM that is specifically designed to take a text based description of a design and convert that to a text based output that represents which colours in which squares - these are automatically applied to the edit section.

So the user prompts the LLM (whatever best model used with a groq call)
The backend has a system prompt that makes the prompt give an output for only the colours and positions
These are automatically applied to the eidt grid
The user sees the grid with updates automatically
```
