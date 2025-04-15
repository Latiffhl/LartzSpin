const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const addNameBtn = document.getElementById('addName');
const nameInput = document.getElementById('nameInput');
const nameList = document.getElementById('nameList');
const expandButton = document.getElementById('expandButton');
const collapseButton = document.getElementById('collapseButton');
const expandedCard = document.getElementById('expandedCard');
const expandedList = document.getElementById('expandedList');
const saveNotesButton = document.getElementById('saveNotesButton');
const spinNotes = document.getElementById('spinNotes');
const notesNotification = document.getElementById('notesNotification');

let names = [];
let angle = 0;
let spinning = false;

function drawWheel() {
  const radius = canvas.width / 2;
  const step = (2 * Math.PI) / names.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  for (let i = 0; i < names.length; i++) {
    const start = i * step;
    const end = start + step;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillStyle = `hsl(${i * (360 / names.length)}, 70%, 60%)`;
    ctx.arc(0, 0, radius, start, end);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.save();
    ctx.rotate(start + step / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(names[i], radius - 10, 5);
    ctx.restore();
  }
  ctx.restore();
}

function spinWheel() {
  if (names.length < 2 || spinning) return;
  spinning = true;
  let velocity = Math.random() * 0.2 + 0.3;
  let deceleration = 0.995;
  function animate() {
    angle += velocity;
    velocity *= deceleration;
    drawAnimatedWheel();
    if (velocity < 0.002) {
      spinning = false;
      const normalizedAngle = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);
      const index = Math.floor(normalizedAngle / ((2 * Math.PI) / names.length));
      showNotification(`Terpilih: ${names[index]}`);
    } else {
      requestAnimationFrame(animate);
    }
  }
  animate();
}

function showNotification(message) {
  const notificationCard = document.getElementById('notificationCard');
  const notificationText = document.getElementById('notificationText');
  const notificationButton = document.getElementById('notificationButton');
  const overlay = document.getElementById('overlay');

  notificationText.textContent = message;
  notificationCard.classList.remove('hidden', 'hide');
  notificationCard.classList.add('show');
  overlay.classList.remove('hidden');
  overlay.classList.add('show');

  notificationButton.addEventListener(
    'click',
    () => {
      notificationCard.classList.remove('show');
      notificationCard.classList.add('hide');
      overlay.classList.remove('show');
      setTimeout(() => {
        notificationCard.classList.add('hidden');
        overlay.classList.add('hidden');
      }, 500); // Match the duration of the slide-out animation
    },
    { once: true }
  );
}

function drawAnimatedWheel() {
  const radius = canvas.width / 2;
  const step = (2 * Math.PI) / names.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(angle);
  for (let i = 0; i < names.length; i++) {
    const start = i * step;
    const end = start + step;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillStyle = `hsl(${i * (360 / names.length)}, 70%, 60%)`;
    ctx.arc(0, 0, radius, start, end);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.save();
    ctx.rotate(start + step / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(names[i], radius - 10, 5);
    ctx.restore();
  }
  ctx.restore();
}

addNameBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name !== '') {
    names.push(name);
    nameInput.value = '';
    renderNameList();
    drawWheel();
  }
});

nameInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const name = nameInput.value.trim();
    if (name !== '') {
      names.push(name);
      nameInput.value = '';
      renderNameList();
      drawWheel();
    }
  }
});

function renderNameList() {
  nameList.innerHTML = ''; // Clear the table body

  if (names.length === 0) {
    expandButton.style.display = 'none'; // Hide the expand button if no inputs
  } else {
    expandButton.style.display = 'inline-block'; // Show the expand button if inputs exist
  }

  names.forEach((n, index) => {
    const tr = document.createElement('tr');

    const tdNumber = document.createElement('td'); // Add numbering column
    tdNumber.textContent = index + 1; // Number starts from 1
    tdNumber.style.fontWeight = 'bold'; // Optional: Make the number bold

    const tdName = document.createElement('td');
    tdName.textContent = n;

    const tdActions = document.createElement('td');
    tdActions.classList.add('action-buttons');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editName(index));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus';
    deleteButton.addEventListener('click', () => deleteName(index));

    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);

    tr.appendChild(tdNumber); // Append numbering column
    tr.appendChild(tdName);
    tr.appendChild(tdActions);
    nameList.appendChild(tr);
  });
}

function editName(index) {
  const editCard = document.getElementById('editCard');
  const editInput = document.getElementById('editInput');
  const editOkButton = document.getElementById('editOkButton');
  const editCancelButton = document.getElementById('editCancelButton');
  const overlay = document.getElementById('overlay');

  // Show the edit card with animation
  editCard.classList.remove('hidden', 'hide');
  editCard.classList.add('show');
  overlay.classList.remove('hidden');
  overlay.classList.add('show');
  editInput.value = names[index]; // Populate the input with the current name or number
  editInput.focus(); // Focus the input field for editing

  // Handle OK button click
  const handleOkClick = () => {
    const newName = editInput.value.trim();
    if (newName !== '') {
      names[index] = newName; // Update the name or number in the array
      renderNameList(); // Re-render the name list
      drawWheel(); // Redraw the wheel to reflect changes
    }
    closeEditCard();
  };

  // Handle Cancel button click
  const handleCancelClick = closeEditCard;

  // Attach event listeners
  editOkButton.addEventListener('click', handleOkClick, { once: true });
  editCancelButton.addEventListener('click', handleCancelClick, { once: true });

  function closeEditCard() {
    editCard.classList.remove('show');
    editCard.classList.add('hide');
    overlay.classList.remove('show');
    overlay.classList.add('hidden');
    setTimeout(() => {
      editCard.classList.add('hidden');
    }, 500); // Match the duration of the slide-out animation
  }
}

function deleteName(index) {
  const overlay = document.getElementById('overlay');
  const notificationCard = document.getElementById('notificationCard');
  const notificationText = document.getElementById('notificationText');
  const notificationButton = document.getElementById('notificationButton');
  const cancelButton = document.createElement('button'); // Create a Cancel button

  // Show confirmation modal
  notificationText.textContent = `Apakah Anda yakin ingin menghapus "${names[index]}"?`;
  notificationCard.classList.remove('hidden', 'hide');
  notificationCard.classList.add('show');
  overlay.classList.remove('hidden');

  // Add Cancel button to the notification card
  cancelButton.textContent = 'Cancel';
  cancelButton.style.marginLeft = '10px';
  cancelButton.style.backgroundColor = '#f44336';
  cancelButton.style.color = 'white';
  cancelButton.style.border = 'none';
  cancelButton.style.padding = '0.5rem 1rem';
  cancelButton.style.borderRadius = '8px';
  cancelButton.style.cursor = 'pointer';
  cancelButton.style.fontSize = '1rem';
  cancelButton.style.fontWeight = 'bold';
  cancelButton.style.transition = 'background-color 0.3s ease';
  notificationCard.appendChild(cancelButton);

  // Handle OK button click
  notificationButton.onclick = () => {
    names.splice(index, 1); // Remove the selected name or number from the array
    renderNameList(); // Re-render the table
    drawWheel(); // Redraw the wheel to reflect changes
    closeNotificationCard();
  };

  // Handle Cancel button click
  cancelButton.onclick = closeNotificationCard;

  function closeNotificationCard() {
    notificationCard.classList.remove('show');
    notificationCard.classList.add('hide');
    overlay.classList.add('hidden');
    cancelButton.remove(); // Remove the Cancel button after closing
  }
}

expandButton.addEventListener('click', () => {
  expandedList.innerHTML = ''; // Clear the expanded list
  names.forEach((name, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${name}`; // Add numbering
    expandedList.appendChild(li);
  });
  expandedCard.classList.remove('hide'); // Remove hide class if present
  expandedCard.classList.add('show'); // Add show class for animation
});

collapseButton.addEventListener('click', () => {
  expandedCard.classList.remove('show'); // Remove show class
  expandedCard.classList.add('hide'); // Add hide class for animation
  setTimeout(() => {
    expandedCard.classList.remove('hide'); // Reset the state after animation
  }, 500); // Match the duration of the slide-out animation
});

spinButton.addEventListener('click', spinWheel);

saveNotesButton.addEventListener('click', () => {
  const notes = spinNotes.value.trim();
  if (notes) {
    navigator.clipboard
      .writeText(notes)
      .then(() => {
        // Show notification
        notesNotification.classList.remove('hidden', 'hide');
        notesNotification.classList.add('show');
        setTimeout(() => {
          notesNotification.classList.remove('show');
          notesNotification.classList.add('hide');
          setTimeout(() => {
            notesNotification.classList.add('hidden');
          }, 300); // Match the hide animation duration
        }, 2000); // Show notification for 2 seconds
        spinNotes.value = ''; // Clear the textarea after saving
      })
      .catch(() => {
        alert('Gagal menyalin catatan ke clipboard.');
      });
  } else {
    alert('Catatan kosong. Silakan tulis sesuatu.');
  }
});
