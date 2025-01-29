const editButtons = document.getElementsByClassName("btn-edit");
const scoreText = document.getElementById("id_body");
const scoreForm = document.getElementById("scoreForm");
const submitButton = document.getElementById("submitButton");

/**
* Initializes edit functionality for the provided edit buttons.
* 
* For each button in the `editButtons` collection:
* - Retrieves the associated score's ID upon click.
* - Fetches the alias of the corresponding score.
* - Populates the `scoreAlias` input/textarea with the score's alias for editing.
* - Updates the submit button's text to "Update".
* - Sets the form's action attribute to the `edit_score/{scoreId}` endpoint.
*/
for (let button of editButtons) {
  button.addEventListener("click", (e) => {
    let scoreId = e.target.getAttribute("score_id");
    let scoreAlias = document.getElementById(`score${scoreId}`).innerText;
    scoreText.value = scoreAlias;
    submitButton.innerText = "Update";
    scoreForm.setAttribute("action", `edit_score/${scoreId}`);
  });
}