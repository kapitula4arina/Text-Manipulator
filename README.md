# 🧩 Text Manipulator (Vanilla JS)

Interactive text manipulation playground built with **pure JavaScript and CSS**, based on a test assignment.  
The user can input any text, highlight individual or multiple characters, and freely move them around the screen.

---

## 🎯 Task Description

The application implements the following requirements:

- On the page there are two main elements:
  - `input` for entering text  
  - `button` to apply the result
- The user enters any string into the input.
- After clicking the button, the entered string is displayed under the form.

### 🔠 Letter selection & movement

The app supports **two types of letter selection and movement**:

1. **Single-letter selection**
2. **Multi-letter selection**

#### 1) Selection by rectangle (drag selection)

- The user holds down the mouse button and drags, creating a rectangle.
- All characters that fall into this rectangle become **selected**.
- Selected characters change color to indicate active state.

#### 2) Selection with `Ctrl` + click

- The user can select multiple letters by clicking them while holding the `Ctrl` key.
- Selected letters change color.
- Repeated click on an already selected letter removes its selection.

---

### 🚚 Letter movement logic

Depending on the selection, the following movement behavior is implemented:

- The user can grab **one or several selected letters** and drag them with the cursor to any place on the screen.
- After releasing the mouse, the letters are placed at the **final cursor position**.
- If a letter (in mode 4A from the task) is dropped onto another letter’s position:
  - The second letter moves to the previous position of the dragged one (they do not overlap).
- The user can:
  - move **a single letter**,
  - or **scatter an entire word across the document**, placing letters in different positions.

---

## 🧰 Tech Stack

- **JavaScript (ES6+)**
- **HTML5**
- **CSS3**

> No external libraries were used.  
> No drag&drop frameworks or helper utilities — all logic is implemented with pure JS and DOM APIs.

---

## 🚀 How to Run

```bash
# clone the repository
git clone https://github.com/kapitula4arina/Text-Manipulator.git

cd Text-Manipulator

# open index.html in your browser
# either by double click or using Live Server / simple static server

---

## 🔗 Live Demo

👉 **https://kapitula4arina.github.io/Text-Manipulator/**  
📁 Repository: https://github.com/kapitula4arina/Text-Manipulator

---

## 👩‍💻 Author

**Oryna Kapitula**  
Junior Fullstack Developer  

📍 Zhytomyr, Ukraine  
📧 Email: `verhovskayarina@gmail.com`  
🔗 LinkedIn: *https://www.linkedin.com/in/oryna-kapitula/*  
💬 Telegram: `@chuu341`

---
