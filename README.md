# Capstone Arcade
**Live link:**

## Overview

## Purpose

## Target Audience

## Wireframe

## User Stories

## Design Decisions
### Visual

### Sound

### Game

### Back-end

## Technologies
**8-Bit Painter:**

**pixilart.com:**

## Deployment
**Going Live (GitHub):**

**Going Live (Heroku):**

## Testing Results
**Google Chrome:**

**Django Debugging:**

## Validation
### HTML Validation (Git Hash: "f9803fcd5fbd0eb9c35227b32ba9dbdbbf7f1855")
**"The element `label` must not appear as a descendant of the `a` element." (*base.html -> lines 27, 35, 39, and 42*):** This would require refactoring the label elements to something else. I chose span as another simple inline element.

**"An `img` element must have an `alt` attribute, except under certain conditions." (*index.html -> lines 23, and 54*):** This was an oversight. I chose the alt values of "snake preview" and "frogger preview" respectively.

**"Element `title` not allowed as child of element `header` in this context." (*snake.html -> line 12*):** This element was removed

**"Stray start/end tag `tr`, `td`, `th`" (*game.html -> lines 40, and 41*):** These table elements have been generated by Django with `{{ score_form }}` and `{% csrf_token %}`. However, for each error indicating a "stray" openning tag by W3C, there is an associated error flagging the respective closing tag, also as "stray". So I have chosen to overlook this.

**" Attribute `name` not allowed on element `div` at this point. (*game.html -> line 56*)":** This attribute was added niavely to abide scroll snapping. It was removed at no effect to scroll snapping.

**"Heading cannot be a child of another heading.", "End tag `div` seen, but there were open elements.", "Unclosed element `h1`." and "Empty heading." (*frogger.html -> line 14*):** The `h1` element's closing tag lacked a backslash. This was ammended.

**"The `name` attribute on the `img` element is obsolete. Use the `id` attribute instead.":** This was a misconception of the accessibility principles, and was altogether removed.

**"End tag `p` implied, but there were open elements." and "No `p` element in scope but a `p` end tag seen." (*signup.html -> line 17*):** These `p` elements have been generated by Django with `{% csrf_token %}` and `{{ form.as_p }}`. However, each error is the other's explicator.
*signup.html -> lines 25, and 26*

**"End tag `p` implied, but there were open elements." and "No `p` element in scope but a `p` end tag seen." (*signup.html -> lines 25, and 26*):** These `p` elements have been generated by Django with `{% csrf_token %}` and `{{ form.as_p }}`. However, each error is the other's explicator. So I have chosen to overlook this.

**"Unclosed element `span`." and "Stray end tag `span`." (*signup.html -> lines 25, and 26*):** As with the previous errors, I have interpretted these errors in Django's generated html as non-issues.

### CSS Validation (Git Hash: "418a36df84b7f88c411c73d39c6c3650b426d75a" and "")
**"Value Error : padding-top `-12px` negative values are not allowed" (*indexStyles.css -> line 17*):** This was adjusted to `padding-bottom: 12px;`

**"Due to their dynamic nature, CSS variables are currently not statically checked":** Here, I ammended my declared variables in `:root { ... }` of styles.css to accountStyles.css, gameStyles.css, and indexStyles.css.

**"Property `container-type`/`container-name` doesn't exist" and "Unrecognized at-rule `@container`" (*gameStyles.css -> lines 67, and 68, 250, 276*):** Container queries and their use is outlined in w3's own documentation (https://www.w3.org/TR/css-contain-3/#container-queries). So I have chosen to overlook this.

## Dependencies:
**HTML Validator:** https://validator.w3.org

**CSS Validator:** https://jigsaw.w3.org/css-validator/