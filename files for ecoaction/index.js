const table = document.getElementById("volunteerTable");
const form = document.getElementById("signupForm");
const notes = document.querySelectorAll(".note");
const updates = document.querySelector("#updates .content");

/* MAP */
const map = L.map('map').setView([13.9462608,120.94088389], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

/* LOAD VOLUNTEERS */
async function loadVolunteers(){
    const res = await fetch("ecoaction.php");
    const data = await res.json();

    table.innerHTML = `<tr>
        <th>Name</th><th>Contact</th><th>Availability</th><th>Action</th>
    </tr>`;

    data.forEach(v=>{
        const r = table.insertRow();
        r.insertCell().innerText = v.name;
        r.insertCell().innerText = v.contact;
        r.insertCell().innerText = v.availability;

        const c = r.insertCell();
        const b = document.createElement("button");
        b.innerText="Delete";
        b.onclick=async()=>{
            await fetch(`ecoaction.php?id=${v.id}`,{method:"DELETE"});
            loadVolunteers();
        };
        c.appendChild(b);
    });
}

/* ADD VOLUNTEER */
form.addEventListener("submit", async e=>{
    e.preventDefault();
    await fetch("ecoaction.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name:name.value,
            contact:contact.value,
            availability:availability.value
        })
    });
    form.reset();
    loadVolunteers();
});

/* NOTES SAVE/LOAD */
notes.forEach((note,i)=>{
    note.contentEditable = true;
    note.addEventListener("blur", async ()=>{
        await fetch("ecoaction.php?type=notes",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({note_index:i, content:note.innerText})
        });
    });
});
async function loadNotes(){
    const res = await fetch("ecoaction.php?type=notes");
    const data = await res.json();
    data.forEach(n=>{
        if(notes[n.note_index]) notes[n.note_index].innerText = n.content;
    });
}

/* UPDATES SAVE/LOAD */
updates.contentEditable = true;
updates.addEventListener("blur", async ()=>{
    await fetch("ecoaction.php?type=updates",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({location:"agoncillo", content:updates.innerText})
    });
});
async function loadUpdates(){
    const res = await fetch("ecoaction.php?type=updates");
    const data = await res.json();
    data.forEach(u=>{
        if(u.location==="agoncillo") updates.innerText = u.content;
    });
}

loadVolunteers();
loadNotes();
loadUpdates();