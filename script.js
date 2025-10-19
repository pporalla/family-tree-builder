const landingPage = document.getElementById('landingPage');
const startBtn = document.getElementById('startBtn');
const familyTreePage = document.getElementById('familyTreePage');
const backBtn = document.getElementById('backBtn');

startBtn.addEventListener('click', () => {
    landingPage.classList.add('hidden');       
    familyTreePage.classList.remove('hidden'); 
    familyTreePage.scrollIntoView({ behavior: 'smooth' });
});

// Go back to Landing / Rules
backBtn.addEventListener('click', () => {
    familyTreePage.classList.add('hidden');    
    landingPage.classList.remove('hidden');    
    landingPage.scrollIntoView({ behavior: 'smooth' });    
});

// ===== FAMILY DATA =====
let familyData = [];

// ===== GLOBAL VARIABLES =====
let memberId = 2;
const treeContainer = document.getElementById('familyTree');
const form = document.getElementById('memberForm');
const parentSelect = document.getElementById('parentSelect');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalRelation = document.getElementById('modalRelation');
const modalDOB = document.getElementById('modalDOB');
const modalDesc = document.getElementById('modalDesc');
const closeModal = document.getElementById('closeModal');

// ===== CREATE NODE =====
function createNode(member) {
    const node = document.createElement('div');
    node.className = 'tree-node';

    const img = document.createElement('img');
    img.src = member.img || 'assets/default.png';
    img.alt = member.name;

    const name = document.createElement('p');
    name.textContent = member.name;

    node.appendChild(img);
    node.appendChild(name);

    node.addEventListener('click', e => {
        e.stopPropagation();
        modal.style.display = 'block';
        modalImg.src = img.src;
        modalName.textContent = member.name;
        modalRelation.textContent = `Relation: ${member.relation}`;
        modalDOB.textContent = `DOB: ${member.dob}`;
        modalDesc.textContent = member.desc;
    });

    if (member.children && member.children.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-children';
        member.children.forEach(child => {
            childrenContainer.appendChild(createNode(child));
        });
        node.appendChild(childrenContainer);
    }

    return node;
}

// ===== BUILD TREE =====
function buildTree() {
    treeContainer.innerHTML = '';
    familyData.forEach(member => {
        treeContainer.appendChild(createNode(member));
    });
    updateParentDropdown();
}

// ===== UPDATE PARENT DROPDOWN =====
function updateParentDropdown() {
    parentSelect.innerHTML = '<option value="">--No Parent (Root)--</option>';
    function traverse(member) {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name + ' (' + member.relation + ')';
        parentSelect.appendChild(option);
        member.children.forEach(child => traverse(child));
    }
    familyData.forEach(member => traverse(member));
}

// ===== ADD MEMBER =====
form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const relation = document.getElementById('relation').value;
    const dob = document.getElementById('dob').value;
    const desc = document.getElementById('desc').value;
    const img = document.getElementById('img').value || 'assets/default.png';
    const parentId = parentSelect.value;

    const newMember = { id: memberId++, name, relation, dob, desc, img, children: [] };

    if (parentId === '') {
        familyData.push(newMember);
    } else {
        function findParent(member) {
            if (member.id == parentId) {
                member.children.push(newMember);
                return true;
            }
            return member.children.some(child => findParent(child));
        }
        familyData.forEach(member => findParent(member));
    }

    form.reset();
    buildTree();
});

// ===== MODAL EVENTS =====
closeModal.onclick = function() {
    modal.style.display = 'none';
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// ===== GLOBAL VARIABLE FOR UPLOADED IMAGE =====
let uploadedImgData = 'assets/default.png'; // default image

const imgFile = document.getElementById('imgFile');

// Listen for file selection
imgFile.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImgData = e.target.result; // base64 string
        }
        reader.readAsDataURL(file);
    } else {
        uploadedImgData = 'assets/default.png';
    }
});

// ===== ADD MEMBER (MODIFIED) =====
form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const relation = document.getElementById('relation').value;
    const dob = document.getElementById('dob').value;
    const desc = document.getElementById('desc').value;
    const parentId = parentSelect.value;

    const newMember = { 
        id: memberId++, 
        name, 
        relation, 
        dob, 
        desc, 
        img: uploadedImgData, // Use the uploaded image
        children: [] 
    };

    if (parentId === '') {
        familyData.push(newMember);
    } else {
        function findParent(member) {
            if (member.id == parentId) {
                member.children.push(newMember);
                return true;
            }
            return member.children.some(child => findParent(child));
        }
        familyData.forEach(member => findParent(member));
    }

    form.reset(); // Reset form
    uploadedImgData = 'assets/default.png'; // Reset uploaded image
    buildTree();  // Rebuild the tree
});

// ===== INITIAL TREE BUILD =====
buildTree();
