# Capstone Arcade
**Live link:** https://capstone-arcade-5a9455ce2843.herokuapp.com/

## Overview
Capstone Arcade attempts to use CSS Grid to arrange and display fully responsive replications of classic games, programmed in Javascript, within the theme of an old amusement arcade.

## Purpose
Visitors can interact with classic games adapted to a website in a way that preserves the feel of visiting an old-school, 80s amusement arcade.

## Target Audience
Recreational users. The websites core functions do not demand the registration of an account, so users can casually try their hand at Frogger and Snake, without needing to provide any personal information.

## Wireframe

## User Stories

## Design
### Visual
Decisions such as Consolas for the font-face, liberal use of black, with thin white outlines and a neon aqua blue, were all made to curate an atmosphere reminiscent of a darkly lit amusment arcade, with pockets of space bursting with bright colours. I employed gifs to create a dynamic Home Page which, with the flashing lights, would also contribute to this.

### Sound
In producing the audio, several FX such as BitCrusher by Kilohearts were utilized to replicate an older format of digital audio. If given more time, I would love to go through these games and employ an array of sound effects for the player's and game's actions. This, I believe, would greatly elevate the responsiveness of the website.

### Game
**Snake:** Upon reaching an exceptionally high score in Snake, the level becomes staged, and is reset with the introduction of random walls which will kill the player if collided into. This was a creative way to reward the player for become almost too long to be avoidable anymore, and a way to keep the gameplay endless while not compromising on the experience of being able to grow unreasonable long.

**Frogger:** The first stage introduces the player to the controls in a non-lethal way, often generating a 1-up in the form of a fly. This makes the player feel comfortable and capable with the game. The second stage consists exclusively of grass and logs, while the third of grass and road. This introduces the player to each threat type seperately, allowing them to become familiar with the game's mechanics, and draws out these levels into a rich tutorial, complete with level 4 as the first introduction of both threat types together.

**Beginner's Immunity:** In Snake, the player is unable to collide with themselves until they have consumed two apples and grown to a length of 5. Likewise, with Frogger, the player is unkillable until they have navigated the trivial obstacles and proceeded to the next stage. This simple consitency provides a degree of procedure before any score may be set on the site by any user.

### Interactivity
**Game Pad:** For the controls, each game accepts several options for keyboard inputs (i.e. WASD or Arrow Keys), but an array of buttons is also displayed for mobile use. Regardless of input type, the CSS will update on these displayed buttons. This adds another degree of interactivity for users when playing with the keyboard.

### Back-end
**HTML:** Page breaks and DOM manipulation are employed to replicate the effects of using CSS grid for in any event of the styles not loading as they should do.

**Python:** A `ClearScore` method was written to routinely scrape the database of any erroneous game scores that would no longer need to be stored, such as low scores set by guest users of the arcade machines.

## Technologies
**8-Bit Painter and http://pixilart.com/draw:** This IOS and website (respectively) was chosen to create the artwork seen in the games. I opted for a very small resolution of 16x16 so that the sprites would not be challenging for me to create. These tools are designed for drawing at small resolutions.

**https://ezgif.com/:** This website was used to convert screen captures of gameplay into gifs that could be written into the site's homepage. It was simple to use and allowed for clipping and cropping also.

All of these tools made downloading the produced works straight-forward and painless.

**Reaper:** This DAW was chosen to record the theme and end-game audio for Frogger. These were small sections of retro themed music, featuring a ribbeting frog sound effect.

## Deployment
**Going Live (GitHub):** From the git repo, by navigating to `Settings -> Pages`, I selected to deploy from the root of the repo's main branch using `Source: "Deploy from a branch"`. This allowed me to test the html elements before they were configured in the Django framework.

**Going Live (Heroku):** From my dashboard, I used `New` to create the app. By navigating to `Settings -> Reveal Config Vars`, I set the URL of my database provided by Code institute. I then connected the repo to my app by navigating to `Deploy -> Connect to Git Repo`. I navigated to `Deploy Branch` and launched the app from the main branch. Finally, I added Heroku to `config -> settings.py -> ALLOWED_HOSTS` in my project.

## Testing Results
**Using Other Devices:** Through testing across several mobile devices, I discover the site's javascript components to be non-functioning for my phone, which pre-dates IOS 1.6 - I found this to be because DOM manipulation and many style changing Javascript methods are not compatible with older versions of browser like, for example, those installed on outdated operating systems.

**Google Chrome:** With the browser's Dev Tools, I have been able to assess the site's development across a complete range of viewport dimensions, and zoom settings. Furthermore, the tools open up individual element assessment, which has proven extremely important in this project, as so much of the javascript manipulates element positions in the DOM, and element styles.

**Django Debugging:** In using `config -> settings.py -> DEBUG = True ? False`, Django opens up an array of debugging tools with comprehensive error messaging with traceback. I used `DEBUG = TRUE` for creating the custom method `game -> methods.py -> clearScore`, and for configuring Django views, templates, models, forms and urls.`DEBUG` was set to `False` before every deployment.

## Validation
### HTML Validation (Git Hash: *f9803fcd5fbd0eb9c35227b32ba9dbdbbf7f1855*)
**"The element `label` must not appear as a descendant of the `a` element." (*base.html -> lines 27, 35, 39, and 42*):** This would require refactoring the label elements to something else. I chose span as another simple inline element.

**"An `img` element must have an `alt` attribute, except under certain conditions." (*index.html -> lines 23, and 54*):** This was an oversight. I chose the alt values of "snake preview" and "frogger preview" respectively.

**"Element `title` not allowed as child of element `header` in this context." (*snake.html -> line 12*):** This element was removed

**"Stray start/end tag `tr`**, **`td`**,**`th`" (*game.html -> lines 40, and 41*):** These table elements have been generated by Django with `{{ score_form }}` and `{% csrf_token %}`. However, for each error indicating a "stray" openning tag by W3C, there is an associated error flagging the respective closing tag, also as "stray". So I have chosen to overlook this.

**" Attribute `name` not allowed on element `div` at this point. (*game.html -> line 56*)":** This attribute was added niavely to abide scroll snapping. It was removed at no effect to scroll snapping.

**"Heading cannot be a child of another heading."**, **"End tag `div` seen, but there were open elements."**, **"Unclosed element `h1`."** and **"Empty heading." (*frogger.html -> line 14*):** The `h1` element's closing tag lacked a backslash. This was ammended.

**"The `name` attribute on the `img` element is obsolete. Use the `id` attribute instead.":** This was a misconception of the accessibility principles, and was altogether removed.

**"End tag `p` implied, but there were open elements."** and **"No `p` element in scope but a `p` end tag seen." (*signup.html -> line 17*):** These `p` elements have been generated by Django with `{% csrf_token %}` and `{{ form.as_p }}`. However, each error is the other's explicator.
*signup.html -> lines 25, and 26*

**"End tag `p` implied, but there were open elements."** and **"No `p` element in scope but a `p` end tag seen." (*signup.html -> lines 25, and 26*):** These `p` elements have been generated by Django with `{% csrf_token %}` and `{{ form.as_p }}`. However, each error is the other's explicator. So I have chosen to overlook this.

**"Unclosed element `span`."** and **"Stray end tag `span`." (*signup.html -> lines 25, and 26*):** As with the previous errors, I have interpretted these errors in Django's generated html as non-issues.

### CSS Validation (Git Hash: *418a36df84b7f88c411c73d39c6c3650b426d75a* and *b9e052dc7958b17a7cf85d156c9db0ab0b339fd8*)
**"Value Error : padding-top `-12px` negative values are not allowed" (*indexStyles.css -> line 17*):** This was adjusted to `padding-bottom: 12px;`

**"Due to their dynamic nature, CSS variables are currently not statically checked":** Here, I ammended my declared variables in `:root { ... }` of styles.css to accountStyles.css, gameStyles.css, and indexStyles.css.

**"Property `container-type`**/**`container-name` doesn't exist"** and **"Unrecognized at-rule `@container`" (*gameStyles.css -> lines 67, and 68, 250, 276*):** Container queries and their use is outlined in w3's own documentation (https://www.w3.org/TR/css-contain-3/#container-queries). So I have chosen to overlook this.

## Dependencies:
**HTML Validator:** https://validator.w3.org

**CSS Validator:** https://jigsaw.w3.org/css-validator/

**Python Validator:** https://pep8ci.herokuapp.com/

**Background Image:** https://lunacityarcade.com/images/IMGP9846.JPG