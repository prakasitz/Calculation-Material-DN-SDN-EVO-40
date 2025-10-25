(() => {
  // ---- Loading System ----
  let loadingProgress = 0;
  const loadingSteps = [
    { id: 'step1', text: '🔧 กำลังโหลดการตั้งค่า...', duration: 300 },
    { id: 'step2', text: '📁 กำลังโหลดโปรไฟล์...', duration: 400 },
    { id: 'step3', text: '📊 กำลังโหลดข้อมูลรายการ...', duration: 350 },
    { id: 'step4', text: '✨ กำลังสร้างอินเตอร์เฟซ...', duration: 500 }
  ];

  function updateLoadingProgress(step, progress) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
      progressText.textContent = `${progress}%`;
    }

    // Update step status
    loadingSteps.forEach((s, index) => {
      const stepEl = document.getElementById(s.id);
      if (stepEl) {
        if (index < step) {
          stepEl.classList.remove('active');
          stepEl.classList.add('completed');
          stepEl.innerHTML = stepEl.innerHTML.replace('🔧', '✅').replace('📁', '✅').replace('📊', '✅').replace('✨', '✅');
        } else if (index === step) {
          stepEl.classList.add('active');
          stepEl.classList.remove('completed');
        } else {
          stepEl.classList.remove('active', 'completed');
        }
      }
    });
  }

  async function showLoadingSequence() {
    return new Promise((resolve) => {
      let currentStep = 0;
      
      function processStep() {
        if (currentStep >= loadingSteps.length) {
          updateLoadingProgress(currentStep, 100);
          setTimeout(resolve, 200);
          return;
        }

        const step = loadingSteps[currentStep];
        const progress = Math.round(((currentStep + 1) / loadingSteps.length) * 100);
        
        updateLoadingProgress(currentStep, progress);
        
        setTimeout(() => {
          currentStep++;
          processStep();
        }, step.duration);
      }

      processStep();
    });
  }

  function hideLoading() {
    const loadingModal = document.getElementById('loadingModal');
    if (loadingModal) {
      // Show completion message briefly
      const loadingContent = loadingModal.querySelector('.loading-content h2');
      const spinner = loadingModal.querySelector('.loading-spinner');
      
      if (loadingContent && spinner) {
        loadingContent.textContent = '🎉 โหลดเสร็จสิ้น!';
        loadingContent.style.color = '#10b981';
        spinner.style.display = 'none';
        
        // Add success icon
        const successIcon = document.createElement('div');
        successIcon.innerHTML = '✅';
        successIcon.style.fontSize = '60px';
        successIcon.style.marginBottom = '20px';
        spinner.parentNode.replaceChild(successIcon, spinner);
      }
      
      setTimeout(() => {
        loadingModal.classList.add('fade-out');
        setTimeout(() => {
          loadingModal.style.display = 'none';
        }, 500);
      }, 800);
    }
  }

  const MATERIALS = ["เขียว","ม่วง","ขาว","EL","DH","DHF"];
  const DEFAULT_PRICES = { "เขียว":0.8, "ม่วง":0.5, "ขาว":6.0, "EL":7.5, "DH":18, "DHF":1.5 };
  const DEFAULT_RATE = 0.21;

  let ITEMS = [];

  // ---- State (localStorage) ----
  let prices = JSON.parse(localStorage.getItem("bcrm_prices")||"{}");
  prices = {...DEFAULT_PRICES, ...prices};
  let rate = parseFloat(localStorage.getItem("bcrm_rate")||DEFAULT_RATE);
  let owned = JSON.parse(localStorage.getItem("bcrm_owned")||"{}");
  let hideOwned = localStorage.getItem("bcrm_hide")==="1";
  let have = JSON.parse(localStorage.getItem("bcrm_have")||"{}"); // จำนวนที่มีแล้วต่อวัตถุดิบ
  let profiles = {}; // บันทึกโปรไฟล์ต่าง ๆ (จะโหลดจาก JSON)
  let currentProfile = ""; // โปรไฟล์ปัจจุบัน (จะโหลดจาก JSON)
  let isGitHubPages = window.location.hostname.includes('github.io') || window.location.hostname.includes('githubusercontent.com');

  async function loadItems(){
    try {
      console.log("🔄 กำลังโหลด meta_data.json...");
      console.log("🌐 Current URL:", window.location.href);
      
      // Check if running from file:// protocol
      if (window.location.protocol === 'file:') {
        console.warn("⚠️ กำลังรันจาก file:// protocol ซึ่งอาจทำให้โหลด JSON ไม่ได้");
        console.log("💡 แนะนำให้ใช้ HTTP server เช่น Live Server extension");
      }
      
      const response = await fetch("meta_data.json", { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("📡 Response status:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📊 โหลดข้อมูลสำเร็จ:", data.length, "รายการ");
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format - expected array");
      }
      
      if (data.length === 0) {
        throw new Error("Empty data array");
      }
      
      ITEMS = data;
      console.log("✅ โหลด ITEMS เสร็จสิ้น:", ITEMS.length, "รายการ");
      
    } catch (error) {
      console.error("❌ Failed to load item metadata:", error);
      console.error("🔍 กำลังใช้ข้อมูลสำรอง...");
      
      // Fallback to hardcoded data if available
      if (ITEMS.length === 0) {
        ITEMS = [
          { key:"หัว_⭐", name:"หัว ⭐", mats:{ เขียว:60,ม่วง:60,ขาว:0,EL:0,DH:0,DHF:4}, gDirect:40 },
          { key:"หัว_⭐⭐", name:"หัว ⭐⭐", mats:{ เขียว:0,ม่วง:120,ขาว:120,EL:0,DH:0,DHF:20}, gDirect:120 },
          { key:"หัว_⭐⭐⭐", name:"หัว ⭐⭐⭐", mats:{ เขียว:0,ม่วง:0,ขาว:120,EL:120,DH:0,DHF:40}, gDirect:120 }
        ];
        console.log("🔄 ใช้ข้อมูลสำรอง:", ITEMS.length, "รายการ");
      }
      
      // Show user-friendly error
      const errorMsg = `⚠️ ไม่สามารถโหลดข้อมูลจาก meta_data.json ได้\n\nสาเหตุ: ${error.message}\n\n💡 วิธีแก้ไข:\n- ตรวจสอบไฟล์ meta_data.json ในโฟลเดอร์เดียวกับ index.html\n- เปิดผ่าน HTTP server (ไม่ใช่ file://)\n- ตรวจสอบ Console ใน Developer Tools เพื่อดูรายละเอียด`;
      
      alert(errorMsg);
    }
  }

  // ---- Profile JSON Management ----
  async function loadProfilesFromJSON() {
    try {
      console.log("🔄 กำลังโหลด profiles.json...");
      const response = await fetch("profiles.json", { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        profiles = data.profiles || {};
        currentProfile = data.currentProfile || "";
        console.log("✅ โหลดโปรไฟล์สำเร็จ:", Object.keys(profiles).length, "รายการ");
      } else {
        console.log("📝 ไม่พบไฟล์ profiles.json จะสร้างใหม่");
        profiles = {};
        currentProfile = "";
      }
    } catch (error) {
      console.warn("⚠️ ไม่สามารถโหลด profiles.json:", error.message);
      
      // Fallback to localStorage for backward compatibility
      const localProfiles = localStorage.getItem("bcrm_profiles");
      const localCurrentProfile = localStorage.getItem("bcrm_current_profile");
      
      if (localProfiles) {
        profiles = JSON.parse(localProfiles);
        currentProfile = localCurrentProfile || "";
        console.log("🔄 ใช้ข้อมูลจาก localStorage:", Object.keys(profiles).length, "รายการ");
        
        // Try to save to JSON for future use
        await saveProfilesToJSON();
      } else {
        profiles = {};
        currentProfile = "";
      }
    }
  }
  
  async function saveProfilesToJSON() {
    try {
      const data = {
        profiles: profiles,
        currentProfile: currentProfile,
        lastUpdated: new Date().toISOString()
      };
      
      const jsonData = JSON.stringify(data, null, 2);
      
      if (isGitHubPages) {
        // On GitHub Pages, we'll use localStorage as fallback since we can't write files
        localStorage.setItem("bcrm_profiles", JSON.stringify(profiles));
        localStorage.setItem("bcrm_current_profile", currentProfile);
        console.log("📱 GitHub Pages: บันทึกลง localStorage");
        return true;
      } else {
        // For local development, create downloadable JSON
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Auto-download updated profiles.json
        const a = document.createElement('a');
        a.href = url;
        a.download = 'profiles.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log("💾 ดาวน์โหลด profiles.json ใหม่");
        
        // Also save to localStorage as backup
        localStorage.setItem("bcrm_profiles", JSON.stringify(profiles));
        localStorage.setItem("bcrm_current_profile", currentProfile);
        
        return true;
      }
    } catch (error) {
      console.error("❌ ไม่สามารถบันทึก profiles:", error);
      
      // Fallback to localStorage
      localStorage.setItem("bcrm_profiles", JSON.stringify(profiles));
      localStorage.setItem("bcrm_current_profile", currentProfile);
      
      return false;
    }
  }

  // ---- Profile Management ----
  async function saveProfile(name) {
    if (!name || name.trim() === "") {
      alert("กรุณาใส่ชื่อโปรไฟล์");
      return false;
    }
    
    const profileData = {
      prices: {...prices},
      rate: rate,
      have: {...have},
      owned: {...owned},
      hideOwned: hideOwned,
      createdAt: profiles[name]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    profiles[name] = profileData;
    currentProfile = name;
    
    // Save to JSON file
    await saveProfilesToJSON();
    
    updateProfileSelect();
    return true;
  }
  
  async function loadProfile(name) {
    if (!name || !profiles[name]) {
      alert("ไม่พบโปรไฟล์ที่เลือก");
      return false;
    }
    
    const profileData = profiles[name];
    
    // Update state with profile data
    prices = {...DEFAULT_PRICES, ...profileData.prices};
    rate = profileData.rate || DEFAULT_RATE;
    have = {...profileData.have} || {};
    owned = {...profileData.owned} || {};
    hideOwned = profileData.hideOwned || false;
    
    // Update localStorage
    localStorage.setItem("bcrm_prices", JSON.stringify(prices));
    localStorage.setItem("bcrm_rate", rate);
    localStorage.setItem("bcrm_have", JSON.stringify(have));
    localStorage.setItem("bcrm_owned", JSON.stringify(owned));
    localStorage.setItem("bcrm_hide", hideOwned ? "1" : "0");
    
    currentProfile = name;
    
    // Update profile data with last accessed time
    profiles[name].updatedAt = new Date().toISOString();
    
    // Save updated profile data
    await saveProfilesToJSON();
    
    // Show active profile status
    const statusEl = document.getElementById("profileStatus");
    if (statusEl) {
      statusEl.style.display = "inline-block";
      statusEl.textContent = `✅ ${name}`;
      statusEl.className = "badge";
    }
    
    updateProfileSelect();
    renderAll();
    return true;
  }
  
  async function deleteProfile(name) {
    if (!name || !profiles[name]) {
      alert("ไม่พบโปรไฟล์ที่เลือก");
      return false;
    }
    
    if (!confirm(`ต้องการลบโปรไฟล์ "${name}" หรือไม่?`)) {
      return false;
    }
    
    delete profiles[name];
    
    if (currentProfile === name) {
      currentProfile = "";
    }
    
    // Save updated profiles
    await saveProfilesToJSON();
    
    updateProfileSelect();
    return true;
  }
  
  function updateProfileSelect() {
    const select = document.getElementById("profileSelect");
    select.innerHTML = '<option value="">-- เลือกโปรไฟล์ --</option>';
    
    // Sort profiles by last updated time (most recent first)
    const sortedProfiles = Object.keys(profiles).sort((a, b) => {
      const timeA = new Date(profiles[a].updatedAt || profiles[a].createdAt).getTime();
      const timeB = new Date(profiles[b].updatedAt || profiles[b].createdAt).getTime();
      return timeB - timeA;
    });
    
    sortedProfiles.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      const lastUpdate = new Date(profiles[name].updatedAt || profiles[name].createdAt);
      const timeStr = lastUpdate.toLocaleDateString('th-TH') + ' ' + lastUpdate.toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'});
      option.textContent = `${name} (${timeStr})`;
      if (name === currentProfile) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    
    // Update profile count display
    const profileCount = Object.keys(profiles).length;
    const noteEl = document.querySelector('.card h2 + .note');
    if (noteEl) {
      noteEl.textContent = `บันทึกและโหลดการตั้งค่าต่าง ๆ (ราคา, เรทเงิน, วัตถุดิบที่มี) - มี ${profileCount} โปรไฟล์`;
    }
  }
  
  function exportProfiles() {
    const exportData = {
      profiles: profiles,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `calculation-profiles-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  function importProfiles(fileContent) {
    try {
      const importData = JSON.parse(fileContent);
      
      if (!importData.profiles || typeof importData.profiles !== 'object') {
        throw new Error('ไฟล์ไม่ถูกต้อง: ไม่พบข้อมูลโปรไฟล์');
      }
      
      const importCount = Object.keys(importData.profiles).length;
      const confirmMsg = `พบโปรไฟล์ ${importCount} รายการ\nต้องการนำเข้าข้อมูลหรือไม่?\n\n⚠️ โปรไฟล์ที่มีชื่อซ้ำจะถูกเขียนทับ`;
      
      if (!confirm(confirmMsg)) {
        return false;
      }
      
      // Merge imported profiles
      let mergedCount = 0;
      Object.keys(importData.profiles).forEach(name => {
        profiles[name] = {
          ...importData.profiles[name],
          importedAt: new Date().toISOString()
        };
        mergedCount++;
      });
      
      localStorage.setItem("bcrm_profiles", JSON.stringify(profiles));
      updateProfileSelect();
      
      alert(`นำเข้าโปรไฟล์สำเร็จ: ${mergedCount} รายการ`);
      return true;
      
    } catch (error) {
      alert(`เกิดข้อผิดพลาดในการนำเข้า: ${error.message}`);
      return false;
    }
  }
  
  async function autoSaveCurrentProfile() {
    if (currentProfile && profiles[currentProfile]) {
      // Show saving indicator
      const statusEl = document.getElementById("profileStatus");
      if (statusEl) {
        statusEl.style.display = "inline-block";
        statusEl.textContent = "🔄 บันทึก...";
        statusEl.className = "badge";
      }
      
      // Auto-save current profile when values change
      const profileData = {
        prices: {...prices},
        rate: rate,
        have: {...have},
        owned: {...owned},
        hideOwned: hideOwned,
        createdAt: profiles[currentProfile].createdAt,
        updatedAt: new Date().toISOString()
      };
      
      profiles[currentProfile] = profileData;
      
      // Save to JSON (debounced to avoid too many saves)
      clearTimeout(autoSaveCurrentProfile.saveTimeout);
      autoSaveCurrentProfile.saveTimeout = setTimeout(async () => {
        await saveProfilesToJSON();
      }, 2000);
      
      // Show saved indicator
      if (statusEl) {
        statusEl.textContent = "✅ บันทึกแล้ว";
        statusEl.className = "badge";
      }
      
      // Update select display to show new time (debounced)
      clearTimeout(autoSaveCurrentProfile.timeout);
      autoSaveCurrentProfile.timeout = setTimeout(() => {
        updateProfileSelect();
        // Hide status after a delay
        setTimeout(() => {
          if (statusEl) {
            statusEl.style.display = "none";
          }
        }, 2000);
      }, 1000);
    }
  }

  // ---- Helpers ----
  const fmtG   = n => n.toLocaleString("th-TH",{maximumFractionDigits:2});
  const fmtTHB = n => n.toLocaleString("th-TH",{style:"currency",currency:"THB",maximumFractionDigits:2});
  const itemCostG = it =>
    MATERIALS.reduce((a,m)=>a+(it.mats[m]||0)*(prices[m]||0),0) + (it.gDirect||0);

  // ---- Build price inputs ----
  const priceInputs = document.getElementById("priceInputs");
  MATERIALS.forEach(m=>{
    const el=document.createElement("label");
    el.className="grid";
    el.innerHTML=`<span class="small">${m} (ราคา/หน่วย)</span>
      <input type="number" step="0.0001" id="p_${m}" value="${prices[m]}">`;
    priceInputs.appendChild(el);
    el.querySelector("input").addEventListener("input",e=>{
      prices[m]=parseFloat(e.target.value)||0;
      localStorage.setItem("bcrm_prices",JSON.stringify(prices));
      autoSaveCurrentProfile();
      renderAll();
    });
  });

  // ---- Build "have" inputs ----
  const haveInputs = document.getElementById("haveInputs");
  MATERIALS.forEach(m=>{
    const el=document.createElement("label");
    el.className="grid";
    el.innerHTML=`<span class="small">${m} (มีแล้ว)</span>
      <input type="number" step="1" min="0" id="h_${m}" value="${have[m]||0}">`;
    haveInputs.appendChild(el);
    el.querySelector("input").addEventListener("input",e=>{
      have[m]=Math.max(0, parseFloat(e.target.value)||0);
      localStorage.setItem("bcrm_have",JSON.stringify(have));
      autoSaveCurrentProfile();
      renderAll();
    });
  });

  // ---- Other controls ----
  document.getElementById("rateTHB").value=rate;
  document.getElementById("rateTHB").addEventListener("input",e=>{
    rate=parseFloat(e.target.value)||0;
    localStorage.setItem("bcrm_rate",rate);
    autoSaveCurrentProfile();
    renderAll();
  });

  document.getElementById("hideOwned").checked=hideOwned;
  document.getElementById("hideOwned").addEventListener("change",e=>{
    hideOwned=e.target.checked;
    localStorage.setItem("bcrm_hide",hideOwned?"1":"0");
    autoSaveCurrentProfile();
    renderAll();
  });

  document.getElementById("resetBtn").addEventListener("click",()=>{
    prices={...DEFAULT_PRICES}; rate=DEFAULT_RATE;
    localStorage.setItem("bcrm_prices",JSON.stringify(prices));
    localStorage.setItem("bcrm_rate",rate);
    // ไม่รีเซ็ต have/owned เพื่อรักษาค่าที่ผู้ใช้กรอก
    renderAll();
  });

  document.getElementById("clearOwnedBtn").addEventListener("click",()=>{
    owned={}; localStorage.setItem("bcrm_owned","{}");
    renderAll();
  });

  // ---- Profile management event listeners ----
  document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    const name = document.getElementById("newProfileName").value.trim();
    if (await saveProfile(name)) {
      document.getElementById("newProfileName").value = "";
      alert(`บันทึกโปรไฟล์ "${name}" เรียบร้อยแล้ว`);
    }
  });
  
  document.getElementById("loadProfileBtn").addEventListener("click", async () => {
    const name = document.getElementById("profileSelect").value;
    if (await loadProfile(name)) {
      alert(`โหลดโปรไฟล์ "${name}" เรียบร้อยแล้ว`);
      // Update all input fields
      MATERIALS.forEach(m => {
        document.getElementById(`p_${m}`).value = prices[m];
        document.getElementById(`h_${m}`).value = have[m] || 0;
      });
      document.getElementById("rateTHB").value = rate;
      document.getElementById("hideOwned").checked = hideOwned;
    }
  });
  
  document.getElementById("deleteProfileBtn").addEventListener("click", async () => {
    const name = document.getElementById("profileSelect").value;
    if (await deleteProfile(name)) {
      alert(`ลบโปรไฟล์ "${name}" เรียบร้อยแล้ว`);
    }
  });
  
  document.getElementById("profileSelect").addEventListener("change", (e) => {
    // Auto-load when selecting a profile (optional - you can remove this if you want manual loading only)
    // if (e.target.value) {
    //   loadProfile(e.target.value);
    // }
  });
  
  document.getElementById("exportProfilesBtn").addEventListener("click", () => {
    if (Object.keys(profiles).length === 0) {
      alert("ไม่มีโปรไฟล์ให้ส่งออก");
      return;
    }
    exportProfiles();
  });
  
  document.getElementById("importProfilesBtn").addEventListener("click", () => {
    document.getElementById("importFileInput").click();
  });
  
  document.getElementById("importFileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      importProfiles(event.target.result);
      // Clear the input so the same file can be selected again
      e.target.value = '';
    };
    reader.readAsText(file);
  });

  // ---- Render items table ----
  function renderTable(){
    const tbody=document.querySelector("#itemsTable tbody");
    tbody.innerHTML="";
    ITEMS.forEach(it=>{
      const costG=itemCostG(it), costTHB=costG*rate;
      const tr=document.createElement("tr");
      if(owned[it.key]) tr.classList.add("row-owned");
      if(hideOwned && owned[it.key]) tr.style.display="none";
      tr.innerHTML=`
        <td>${it.name}</td>
        <td><input type="checkbox" ${owned[it.key]?"checked":""}></td>
        <td>${fmtG(it.mats.เขียว||0)}</td>
        <td>${fmtG(it.mats.ม่วง||0)}</td>
        <td>${fmtG(it.mats.ขาว||0)}</td>
        <td>${fmtG(it.mats.EL||0)}</td>
        <td>${fmtG(it.mats.DH||0)}</td>
        <td>${fmtG(it.mats.DHF||0)}</td>
        <td>${fmtG(it.gDirect||0)}</td>
        <td>${fmtG(costG)}</td>
        <td>${fmtTHB(costTHB)}</td>`;
      tr.querySelector("input").addEventListener("change",e=>{
        owned[it.key]=e.target.checked;
        localStorage.setItem("bcrm_owned",JSON.stringify(owned));
        autoSaveCurrentProfile();
        renderAll();
      });
      tbody.appendChild(tr);
    });
  }

  // ---- Totals + Discount/Remain logic ----
  function calcTotals(){
    // needUnits = วัตถุดิบที่ต้องใช้ทั้งหมดจากรายการที่ "ยังต้องทำ" (ไม่ติ๊กมีแล้ว)
    const needUnits = {เขียว:0,ม่วง:0,ขาว:0,EL:0,DH:0,DHF:0};
    let gDirect = 0;

    ITEMS.forEach(it=>{
      if(owned[it.key]) return; // ข้าม item ที่ทำไปแล้ว
      MATERIALS.forEach(m => needUnits[m] += (it.mats[m]||0));
      gDirect += (it.gDirect || 0);
    });

    // remainUnits = ยังขาด (หักของที่มีแล้ว แต่ไม่ให้ติดลบ)
    const remainUnits = {};
    MATERIALS.forEach(m=>{
      const need = needUnits[m] || 0;
      const hav  = have[m] || 0;
      remainUnits[m] = Math.max(0, need - hav);
    });

    // มูลค่า "ของที่มีแล้ว" ที่สามารถหักได้จริง = min(need, have) * price
    let discountG = 0;
    let materialNeedCostG = 0;
    let remainCostG = 0;

    MATERIALS.forEach(m=>{
      const need = needUnits[m] || 0;
      const hav  = have[m] || 0;
      const price = prices[m] || 0;

      const usable = Math.min(need, hav);        // ใช้ของที่มีได้เท่าไร
      discountG    += usable * price;            // มูลค่าส่วนลด
      materialNeedCostG += need * price;         // ต้นทุน materials ถ้ายังไม่ได้หักของที่มี
      remainCostG  += remainUnits[m] * price;    // ต้นทุน materials หลังหักของที่มี
    });

    const grandG  = remainCostG + gDirect;
    const grandTHB = grandG * rate;

    const progressMat = materialNeedCostG > 0 ? (discountG / materialNeedCostG) : 0; // % ลดจากวัสดุ
    const progressAll = (materialNeedCostG + gDirect) > 0 ? (discountG / (materialNeedCostG + gDirect)) : 0; // % เมื่อรวม fee

    return {
      needUnits, remainUnits,
      materialNeedCostG, discountG, remainCostG,
      gDirect, grandG, grandTHB,
      discountTHB: discountG * rate,
      remainTHB: remainCostG * rate,
      matNeedTHB: materialNeedCostG * rate,
      gDirectTHB: gDirect * rate,
      progressMat, progressAll
    };
  }

  function renderTotals(){
    const t = calcTotals();

    // แสดง "หน่วยวัตถุดิบที่ยังต้องซื้อ" หลังหักของที่มีแล้ว
    MATERIALS.forEach(m=>{
      document.getElementById("sum_units_"+m).textContent = fmtG(t.remainUnits[m] || 0);
    });

    // แสดงต้นทุนวัสดุ (หลังหักของที่มี) + fee + รวม
    document.getElementById("sum_cost_G").textContent       = fmtG(t.remainCostG);
    document.getElementById("sum_cost_THB").textContent     = fmtTHB(t.remainTHB);
    document.getElementById("sum_gdirect").textContent      = fmtG(t.gDirect);
    document.getElementById("sum_gdirect_THB").textContent  = fmtTHB(t.gDirectTHB);
    document.getElementById("grand_G").textContent          = fmtG(t.grandG);
    document.getElementById("grand_THB").textContent        = fmtTHB(t.grandTHB);
    document.getElementById("grandGBadge").textContent      = `${fmtG(t.grandG)} G`;
    document.getElementById("grandTHBBadge").textContent    = fmtTHB(t.grandTHB);

    // กล่องสรุปส่วนลด/ที่ขาด
    const box = document.getElementById("discountSummary");
    const rows = MATERIALS.map(m=>{
      const need = t.needUnits[m] || 0;
      const hav  = have[m] || 0;
      const rem  = t.remainUnits[m] || 0;
      const usable = Math.min(need, hav);
      const price = prices[m] || 0;
      return `
        <tr>
          <td>${m}</td>
          <td class="right">${fmtG(need)}</td>
          <td class="right">${fmtG(hav)}</td>
          <td class="right">${fmtG(rem)}</td>
          <td class="right">${fmtG(usable * price)}</td>
          <td class="right">${fmtG(rem * price)}</td>
        </tr>
      `;
    }).join("");

    box.innerHTML = `
      <div class="note" style="margin-bottom:8px;">
        * ตัวเลขด้านล่างคิดเฉพาะ <strong>วัสดุ</strong> (ไม่รวม Fee). Fee ยังต้องจ่ายเท่าเดิม เว้นแต่ติ๊ก “มีแล้ว” รายการนั้น ๆ
      </div>
      <div style="overflow:auto; border:1px solid #243044; border-radius:8px;">
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left; padding:8px 10px;">วัตถุดิบ</th>
              <th class="right" style="padding:8px 10px;">ต้องใช้</th>
              <th class="right" style="padding:8px 10px;">มีแล้ว</th>
              <th class="right" style="padding:8px 10px;">ขาดอีก</th>
              <th class="right" style="padding:8px 10px;">ลดไป (G)</th>
              <th class="right" style="padding:8px 10px;">ยังขาด (G)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding:8px 10px;"><strong>รวม (วัสดุ)</strong></td>
              <td></td><td></td><td></td>
              <td class="right" style="padding:8px 10px;"><strong>${fmtG(t.discountG)}</strong> <span class="muted">(${fmtTHB(t.discountTHB)})</span></td>
              <td class="right" style="padding:8px 10px;"><strong>${fmtG(t.remainCostG)}</strong> <span class="muted">(${fmtTHB(t.remainTHB)})</span></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
        <div class="pill"><strong>วัสดุทั้งหมด (ก่อนหัก):</strong> ${fmtG(t.materialNeedCostG)} G <span class="muted">(${fmtTHB(t.matNeedTHB)})</span></div>
        <div class="pill"><strong>ส่วนลดจากของที่มี:</strong> ${fmtG(t.discountG)} G <span class="muted">(${fmtTHB(t.discountTHB)})</span></div>
        <div class="pill"><strong>วัสดุที่ยังขาด:</strong> ${fmtG(t.remainCostG)} G <span class="muted">(${fmtTHB(t.remainTHB)})</span></div>
        <div class="pill"><strong>Fee รวม (ไม่ลด):</strong> ${fmtG(t.gDirect)} G <span class="muted">(${fmtTHB(t.gDirectTHB)})</span></div>
        <div class="pill"><strong>ยอดต้องจ่ายตอนนี้:</strong> <span class="badge">${fmtG(t.grandG)} G</span> <span class="badge blue">${fmtTHB(t.grandTHB)}</span></div>
      </div>

      <div class="note" style="margin-top:6px;">
        ความคืบหน้า (วัสดุ): ${(t.progressMat*100).toFixed(1)}% | ความคืบหน้ารวม (วัสดุ+Fee): ${(t.progressAll*100).toFixed(1)}%
      </div>
    `;
  }

  function renderAll(){
    renderTable();
    renderTotals();
  }

  // Init with Loading
  async function initializeApp() {
    try {
      // Show loading sequence
      await showLoadingSequence();
      
      // Load items from meta_data.json
      await loadItems();
      
      // Load profiles from JSON
      await loadProfilesFromJSON();
      
      // Add small delay for final setup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Initialize components
      updateProfileSelect(); // Initialize profile dropdown
      
      // Show GitHub Pages notice if applicable
      if (isGitHubPages) {
        const notice = document.getElementById("githubPagesNotice");
        if (notice) {
          notice.style.display = "block";
        }
      }
      
      // Show current profile status on load
      if (currentProfile && profiles[currentProfile]) {
        const statusEl = document.getElementById("profileStatus");
        if (statusEl) {
          statusEl.style.display = "inline-block";
          statusEl.textContent = `✅ ${currentProfile}`;
          statusEl.className = "badge";
        }
      }
      
      renderAll();
      
      // Hide loading modal
      hideLoading();
      
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      
      // Show error in loading modal
      const loadingContent = document.querySelector('.loading-content h2');
      const loadingSteps = document.querySelector('.loading-steps');
      
      if (loadingContent) {
        loadingContent.textContent = '❌ เกิดข้อผิดพลาดในการโหลด';
        loadingContent.style.color = '#ef4444';
      }
      
      if (loadingSteps) {
        loadingSteps.innerHTML = `
          <div class="loading-step" style="color: #ef4444; opacity: 1;">
            ❌ ${error.message || 'Unknown error'}
          </div>
          <div class="loading-step" style="color: #f59e0b; opacity: 1; margin-top: 10px;">
            💡 กรุณาตรวจสอบ Console ใน Developer Tools (F12)
          </div>
          <div class="loading-step" style="color: #6b7280; opacity: 1; margin-top: 5px;">
            🔄 กำลังพยายามโหลดด้วยข้อมูลสำรอง...
          </div>
        `;
      }
      
      // Try to continue with fallback data
      try {
        renderAll();
      } catch (renderError) {
        console.error('❌ Render error:', renderError);
      }
      
      // Hide loading after error display
      setTimeout(hideLoading, 3000);
    }
  }

  // Start the app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();
