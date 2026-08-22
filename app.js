const $=id=>document.getElementById(id);
const loginView=$('loginView'), appView=$('appView');
let users=[];
let currentUser=null;
let locations=[];
const DEFAULT_LOCATIONS=[{"id":1,"name":"YİM MARKET ESENTEPE","location":"40.76605224609375, 29.797056198120117","note":"Hamit Kaplan Blv. No:224, Körfez, 41780, Kocaeli, TR; güncel koordinat","created":"23.08.2026"},{"id":2,"name":"KRS TOPTAN","location":"40.765586853027344, 29.797380447387695","note":"","created":"23.08.2026"},{"id":3,"name":"FURKAN MARKET","location":"40.77139663696289, 29.750804901123047","note":"","created":"23.08.2026"},{"id":4,"name":"KİRAZ ŞARKÜTERİ","location":"40.770389556884766, 29.755468368530273","note":"","created":"23.08.2026"},{"id":5,"name":"BİZİM BAKKAL","location":"40.769630432128906, 29.758892059326172","note":"","created":"23.08.2026"},{"id":6,"name":"ÖZDEN’İZ MARKET","location":"40.75364685058594, 29.787553787231445","note":"Güncel koordinat","created":"23.08.2026"},{"id":7,"name":"DAĞDEL MARKET","location":"40.75313949584961, 29.779966354370117","note":"Daha önce Dağden Market olarak not edilmişti","created":"23.08.2026"},{"id":8,"name":"DİLBER FIRIN","location":"40.76826858520508, 29.75682830810547","note":"Huzur Izgara ve Öztürk Büfe 3 yan yana","created":"23.08.2026"},{"id":9,"name":"HUZUR IZGARA","location":"40.76826858520508, 29.75682830810547","note":"Dilber Fırın ile aynı/yan yana konum","created":"23.08.2026"},{"id":10,"name":"ÖZTÜRK BÜFE 3","location":"40.76826858520508, 29.75682830810547","note":"Dilber Fırın ile aynı/yan yana konum","created":"23.08.2026"},{"id":11,"name":"İREM MARKET","location":"40.7528528, 29.7947434","note":"Deniz Marketten önce gidilecek","created":"23.08.2026"},{"id":12,"name":"DENİZ MARKET","location":"40.7554817199707, 29.791929244995117","note":"Güncel koordinat; rota: İrem Market → Deniz Market","created":"23.08.2026"},{"id":13,"name":"MAVİ NOKTA PETROL","location":"40.76580810546875, 29.776777267456055","note":"","created":"23.08.2026"},{"id":14,"name":"ÖZGE GIDA","location":"40.76877212524414, 29.78118896484375","note":"","created":"23.08.2026"},{"id":15,"name":"KILIÇ MARKET","location":"40.76852798461914, 29.783266067504883","note":"","created":"23.08.2026"},{"id":16,"name":"SONGUR PETROL","location":"40.772098541259766, 29.757976531982422","note":"","created":"23.08.2026"},{"id":17,"name":"ALTEMUR MARKET","location":"40.7663459777832, 29.784469604492188","note":"","created":"23.08.2026"},{"id":18,"name":"NARİN PİDE LAHMACUN","location":"40.76533126831055, 29.7814884185791","note":"Oğuz Market hemen karşısı","created":"23.08.2026"},{"id":19,"name":"OĞUZ MARKET","location":"40.76533126831055, 29.7814884185791","note":"Narin Pide hemen karşısı; 2. nokta","created":"23.08.2026"},{"id":20,"name":"ÖNDER GIDA","location":"40.76749038696289, 29.790164947509766","note":"","created":"23.08.2026"},{"id":21,"name":"RENA GIDA","location":"40.770790100097656, 29.8353271484375","note":"","created":"23.08.2026"},{"id":22,"name":"MERKEZ BÜFE","location":"40.77708053588867, 29.808673858642578","note":"","created":"23.08.2026"},{"id":23,"name":"YALÇIN BÜFE","location":"40.774349212646484, 29.8071231842041","note":"","created":"23.08.2026"},{"id":24,"name":"BÜFE","location":"40.77622604370117, 29.81587028503418","note":"İsim daha sonra netleştirilebilir","created":"23.08.2026"},{"id":25,"name":"MOPAŞ YENİKENT","location":"Gazi Mustafa Kemal Cad. Yenikent Mah. No:43, 41900 Derince/Kocaeli","note":"","created":"23.08.2026"},{"id":26,"name":"ÖZMAR","location":"40.760986328125, 29.803081512451172","note":"Güncel koordinat","created":"23.08.2026"},{"id":27,"name":"KEREM MARKET","location":"40.76670837402344, 29.809192657470703","note":"","created":"23.08.2026"},{"id":28,"name":"GÖZDE","location":"40.76246643066406, 29.805925369262695","note":"","created":"23.08.2026"},{"id":29,"name":"SEÇ ESENTEPE","location":"40.76472091674805, 29.800352096557617","note":"","created":"23.08.2026"},{"id":30,"name":"YILMAZ MARKET 2","location":"40.76157760620117, 29.79787826538086","note":"Seç Esentepe’nin yanı; Olgunlar Market ile aynı konum","created":"23.08.2026"},{"id":31,"name":"OLGUNLAR MARKET","location":"40.76157760620117, 29.79787826538086","note":"Yılmaz Market 2 ile aynı konum; Yılmaz Market 1 az ileride","created":"23.08.2026"},{"id":32,"name":"TKK ESENTEPE","location":"40.765132904052734, 29.797163009643555","note":"İlerisinde sağda KRS Toptan","created":"23.08.2026"},{"id":33,"name":"NASİP UNLU MAMÜLLERİ","location":"40.766624450683594, 29.794912338256836","note":"Az ilerisi Demircioğlu Döner","created":"23.08.2026"},{"id":34,"name":"MELODİ MARKET","location":"40.76029586791992, 29.794132232666016","note":"","created":"23.08.2026"},{"id":35,"name":"TÜTÜN ÇİFTLİK GIDA PAZARI","location":"40.761409759521484, 29.791051864624023","note":"","created":"23.08.2026"},{"id":36,"name":"YÜKSEL MARKET","location":"40.76747512817383, 29.786727905273438","note":"","created":"23.08.2026"},{"id":37,"name":"UFUK GIDA","location":"40.759368896484375, 29.80202293395996","note":"","created":"23.08.2026"},{"id":38,"name":"KARDEŞLER MİNİ MARKET","location":"40.76920700073242, 29.811199188232422","note":"","created":"23.08.2026"},{"id":39,"name":"İNAN MARKET","location":"40.776607513427734, 29.776132583618164","note":"","created":"23.08.2026"},{"id":40,"name":"ENSA GROSS","location":"40.774688720703125, 29.775304794311523","note":"","created":"23.08.2026"},{"id":41,"name":"ALYAKUT MARKET","location":"40.773780822753906, 29.77729034423828","note":"","created":"23.08.2026"},{"id":42,"name":"GÖKTÜ KARDEŞLER MARKET","location":"40.76517868041992, 29.808748245239258","note":"","created":"23.08.2026"},{"id":43,"name":"ŞİRİN GIDA","location":"40.77535629272461, 29.77172088623047","note":"","created":"23.08.2026"},{"id":44,"name":"DURMUŞLAR MARKET","location":"40.7765998840332, 29.7873477935791","note":"İleride solda Işık Market","created":"23.08.2026"},{"id":45,"name":"ALMAR İLİMTEPE","location":"40.801849365234375, 29.764041900634766","note":"","created":"23.08.2026"},{"id":46,"name":"KARDEŞLER MARKET İLİMTEPE","location":"40.80682373046875, 29.747209548950195","note":"","created":"23.08.2026"},{"id":47,"name":"SICACIK MARKET","location":"40.77133560180664, 29.801389694213867","note":"","created":"23.08.2026"},{"id":48,"name":"ÇEVİK MARKET GIDA","location":"40.77503967285156, 29.801727294921875","note":"","created":"23.08.2026"},{"id":49,"name":"TÜRKÖZ PETROL","location":"40.774478912353516, 29.80294418334961","note":"","created":"23.08.2026"},{"id":50,"name":"ALMAR","location":"40.7645263671875, 29.793563842773438","note":"","created":"23.08.2026"},{"id":51,"name":"EFOR GIDA","location":"40.77537536621094, 29.8110408782959","note":"","created":"23.08.2026"},{"id":52,"name":"ZİRVE TEKEL","location":"40.78242111206055, 29.80310821533203","note":"","created":"23.08.2026"},{"id":53,"name":"SAYGIN FIRIN","location":"40.77574157714844, 29.803993225097656","note":"","created":"23.08.2026"},{"id":54,"name":"EREN / GÖNÜL MARKET","location":"40.773040771484375, 29.791603088378906","note":"İsim: Eren veya Gönül Market","created":"23.08.2026"},{"id":55,"name":"KARDEŞLER MARKET 4748186","location":"40.77587127685547, 29.789548873901367","note":"","created":"23.08.2026"},{"id":56,"name":"ÇEVİKLER MARKET","location":"40.775794982910156, 29.787229537963867","note":"","created":"23.08.2026"},{"id":57,"name":"CRF TÜTÜNÇİFTLİK","location":"40.75920104980469, 29.78795051574707","note":"","created":"23.08.2026"},{"id":58,"name":"MOPAŞ TÜTÜNÇİFTLİK","location":"40.76041793823242, 29.784931182861328","note":"","created":"23.08.2026"},{"id":59,"name":"ATAK GROSS","location":"40.76221466064453, 29.78026008605957","note":"","created":"23.08.2026"},{"id":60,"name":"KAYA ÇİFTLİĞİ GÜNEY","location":"40.75959396362305, 29.786012649536133","note":"","created":"23.08.2026"},{"id":61,"name":"TAÇMAR","location":"40.7520637512207, 29.78391456604004","note":"","created":"23.08.2026"},{"id":62,"name":"HALK MARKET","location":"40.750980377197266, 29.791793823242188","note":"","created":"23.08.2026"},{"id":63,"name":"BALTALAR EKMEK FIRINI","location":"40.75294494628906, 29.79509925842285","note":"İrem Market’in az ilerisi, sağ tarafta","created":"23.08.2026"},{"id":64,"name":"TKK KOCAELİ KÖRFEZ HACI OSMAN","location":"40.774539947509766, 29.751232147216797","note":"İleride solda Peynirci Baba","created":"23.08.2026"},{"id":65,"name":"AKSOYLAR KRYMŞ","location":"40.75479507446289, 29.79606819152832","note":"İleride sağda Kaşarcıoğlu","created":"23.08.2026"},{"id":66,"name":"ARDA MARKET / ARDAN BAKKALİYESİ","location":"40.776309967041016, 29.739572525024414","note":"İleride solda Sis-Mar; az ileride TKK Kocaeli Körfez Bağdat; ileride sağda Çarka Market","created":"23.08.2026"},{"id":67,"name":"TKK 95 EVLER","location":"40.75415802001953, 29.79574203491211","note":"","created":"23.08.2026"},{"id":68,"name":"GÖZDENİZ MARKET","location":"40.75109100341797, 29.79534912109375","note":"","created":"23.08.2026"},{"id":69,"name":"EKOMİNİ ADNAN ERÇİN","location":"40.74982452392578, 29.798044204711914","note":"","created":"23.08.2026"},{"id":70,"name":"UMUT MARKET","location":"40.749820709228516, 29.802526473999023","note":"","created":"23.08.2026"},{"id":71,"name":"YAĞMUR MARKET","location":"40.751529693603516, 29.80546760559082","note":"","created":"23.08.2026"},{"id":72,"name":"GÖNÜL MARKET","location":"40.754432678222656, 29.80286979675293","note":"Eren/Gönül Market kaydından ayrı konum","created":"23.08.2026"},{"id":73,"name":"ÜÇGEN MARKET","location":"40.7780647277832, 29.70747184753418","note":"Güncel koordinat","created":"23.08.2026"},{"id":74,"name":"BEŞENOĞLU DONDURMA","location":"40.75639724731445, 29.803220748901367","note":"","created":"23.08.2026"},{"id":75,"name":"NJET MARKET","location":"40.77901077270508, 29.66660499572754","note":"","created":"23.08.2026"},{"id":76,"name":"LA GOLFO","location":"40.75346755981445, 29.808162689208984","note":"Hemen karşısı Canan Büfe; yaklaşık 100 metre ileride TKK 60 Evler","created":"23.08.2026"},{"id":77,"name":"SİMİT SARAYI DERİNCE","location":"40.75539016723633, 29.809268951416016","note":"Az ilerisi Peynirci Baba; onun az ilerisi Kaya Çiftliği","created":"23.08.2026"},{"id":78,"name":"YAVUZ SULTAN EKMEK PASTA","location":"40.75468826293945, 29.809965133666992","note":"","created":"23.08.2026"},{"id":79,"name":"SULTAN BÜFE","location":"40.78693771362305, 29.61837387084961","note":"","created":"23.08.2026"},{"id":80,"name":"GÜMÜŞ GIDA","location":"40.78591537475586, 29.627450942993164","note":"","created":"23.08.2026"},{"id":81,"name":"KAYA GIDA","location":"40.783870697021484, 29.631406784057617","note":"","created":"23.08.2026"},{"id":82,"name":"OPET KÖRFEZ","location":"40.7769889831543, 29.711862564086914","note":"","created":"23.08.2026"},{"id":83,"name":"MİXSOS DÖNER","location":"40.75977325439453, 29.7860107421875","note":"","created":"23.08.2026"},{"id":84,"name":"NAZAN AİLE BAKKALI","location":"40.77351379394531, 29.759632110595703","note":"","created":"23.08.2026"},{"id":85,"name":"GÖÇMEN BÖREK SAN. VE TİC.","location":"40.773311614990234, 29.743345260620117","note":"","created":"23.08.2026"},{"id":86,"name":"YİM MARKET YARIMCA","location":"40.77291488647461, 29.739173889160156","note":"","created":"23.08.2026"},{"id":87,"name":"DENİZ BÜFE","location":"40.7730598449707, 29.738014221191406","note":"","created":"23.08.2026"},{"id":88,"name":"ATMACA MARKET","location":"40.77790451049805, 29.702293395996094","note":"","created":"23.08.2026"},{"id":89,"name":"NİSA MARKET","location":"40.77793502807617, 29.701480865478516","note":"","created":"23.08.2026"},{"id":90,"name":"TOPRAK MARKET","location":"40.78447723388672, 29.621776580810547","note":"","created":"23.08.2026"},{"id":91,"name":"TKK KOCAELİ KÖRFEZ HEREKE","location":"40.784950256347656, 29.617456436157227","note":"","created":"23.08.2026"},{"id":92,"name":"EMİŞ SPOT MARKET – EMİN SOYLU","location":"40.78505325317383, 29.6171932220459","note":"TKK Kocaeli Körfez Hereke’ye çok yakın","created":"23.08.2026"},{"id":93,"name":"POLAT AVM","location":"40.80143356323242, 29.645427703857422","note":"","created":"23.08.2026"},{"id":94,"name":"ASMAR MARKET","location":"40.80632400512695, 29.64683723449707","note":"","created":"23.08.2026"}];
const LOCAL_LOC_KEY='mby_local_locations_v1';

const LOCAL_KEY='mby_local_users_v2';
let localMode=true;

function localHash(s=''){
  let h=2166136261>>>0;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
  return h.toString(16).padStart(8,'0');
}
function localLoad(){
  try{
    const raw=localStorage.getItem(LOCAL_KEY);
    if(raw){
      const v=JSON.parse(raw);
      if(Array.isArray(v)&&v.length){
        // Eski sürümlerdeki eksik alanları düzelt; kullanıcıları silme.
        v.forEach((u,i)=>{
          if(!u.id)u.id=i+1;
          if(!u.role)u.role='Üye';
          if(!u.status)u.status='Aktif';
          if(!u.created)u.created=new Date().toLocaleString('tr-TR');
        });
        return v;
      }
    }
  }catch{}
  const seed=[{id:1,username:'Admin',password_hash:localHash('635825'),role:'Yönetici',status:'Aktif',created:new Date().toLocaleString('tr-TR')}];
  try{localStorage.setItem(LOCAL_KEY,JSON.stringify(seed))}catch{}
  return seed;
}
function localSave(v){try{localStorage.setItem(LOCAL_KEY,JSON.stringify(v))}catch{}}
function localPublic(u){const {password_hash,...pub}=u;return pub}
function localSessionGet(){try{return JSON.parse(sessionStorage.getItem('mby_local_session')||'null')}catch{return null}}
function localSessionSet(v){try{v?sessionStorage.setItem('mby_local_session',JSON.stringify(v)):sessionStorage.removeItem('mby_local_session')}catch{}}
function localBody(options){try{return JSON.parse(options?.body||'{}')}catch{return {}}}
async function localApi(action, options={}){
  let list=localLoad(), me=localSessionGet(), input=localBody(options);
  if(action==='login'){
    const un=String(input.username||'').trim().toLocaleLowerCase('tr-TR');
    const pw=String(input.password||'');

    // Ana Admin hesabını her cihazda garanti et. Eski localStorage kaydı şifreyi bozmuş olsa bile
    // Admin / 635825 ile giriş yapılınca kayıt kendini otomatik onarır.
    if(un==='admin' && pw==='635825'){
      let admin=list.find(x=>String(x.username||'').trim().toLocaleLowerCase('tr-TR')==='admin');
      if(!admin){
        const max=Math.max(0,...list.map(x=>Number(x.id)||0));
        admin={id:max+1,username:'Admin',password_hash:localHash('635825'),role:'Yönetici',status:'Aktif',created:new Date().toLocaleString('tr-TR')};
        list.unshift(admin);
      }else{
        admin.username='Admin';
        admin.password_hash=localHash('635825');
        admin.role='Yönetici';
        admin.status='Aktif';
      }
      localSave(list);
      me=localPublic(admin);localSessionSet(me);return {ok:true,user:me};
    }

    const u=list.find(x=>{
      const sameUser=String(x.username||'').trim().toLocaleLowerCase('tr-TR')===un;
      const storedHash=x.password_hash||'';
      const legacyPlain=x.password||'';
      return sameUser && (storedHash===localHash(pw) || legacyPlain===pw);
    });
    if(!u)throw new Error('Kullanıcı adı / ID veya şifre hatalı.');
    if(u.status!=='Aktif')throw new Error('Bu kullanıcı hesabı pasif durumda.');
    // Eski düz metin parola kaydını yeni hash yapısına geçir.
    if(u.password && !u.password_hash){u.password_hash=localHash(pw);delete u.password;localSave(list);}
    me=localPublic(u);localSessionSet(me);return {ok:true,user:me};
  }
  if(action==='logout'){localSessionSet(null);return {ok:true}}
  if(action==='me')return {ok:true,user:me};
  if(!me)throw new Error('Oturum bulunamadı.');
  const canManage=['Yönetici','Müdür'].includes(me.role);
  if(action==='users'){if(!canManage)throw new Error('Bu işlem için yetkiniz yok.');return {ok:true,users:list.map(localPublic)}}
  if(['save_user','password','delete_user'].includes(action)&&!canManage)throw new Error('Bu işlem için yetkiniz yok.');
  if(action==='save_user'){
    const id=input.id?Number(input.id):0, username=String(input.username||'').trim(), password=String(input.password||''), role=String(input.role||'Üye'), status=String(input.status||'Aktif');
    if(!username||!['Yönetici','Müdür','Üye'].includes(role)||!['Aktif','Pasif'].includes(status))throw new Error('Kullanıcı bilgileri eksik veya geçersiz.');
    if(!id&&password.length<4)throw new Error('Şifre en az 4 karakter olmalıdır.');
    if(me.role==='Müdür'&&role==='Yönetici')throw new Error('Müdür, Yönetici hesabı oluşturamaz.');
    if(list.some(x=>x.id!==id&&String(x.username).toLocaleLowerCase('tr-TR')===username.toLocaleLowerCase('tr-TR')))throw new Error('Bu kullanıcı adı zaten mevcut.');
    if(id){
      const u=list.find(x=>x.id===id);if(!u)throw new Error('Kullanıcı bulunamadı.');
      if(String(u.username).toLocaleLowerCase('tr-TR')==='admin'&&status!=='Aktif')throw new Error('Ana Admin hesabı pasif yapılamaz.');
      u.username=username;u.role=role;u.status=status;if(password)u.password_hash=localHash(password);
    }else{
      const max=Math.max(0,...list.map(x=>Number(x.id)||0));list.push({id:max+1,username,password_hash:localHash(password),role,status,created:new Date().toLocaleString('tr-TR')});
    }
    localSave(list);return {ok:true};
  }
  if(action==='password'){
    if(String(input.password||'').length<4)throw new Error('Yeni şifre en az 4 karakter olmalıdır.');
    const u=list.find(x=>x.id===Number(input.id));if(!u)throw new Error('Kullanıcı bulunamadı.');u.password_hash=localHash(String(input.password));localSave(list);return {ok:true};
  }
  if(action==='delete_user'){
    const id=Number(input.id),u=list.find(x=>x.id===id);if(!u)throw new Error('Kullanıcı bulunamadı.');if(String(u.username).toLocaleLowerCase('tr-TR')==='admin')throw new Error('Ana Admin kullanıcısı silinemez.');list=list.filter(x=>x.id!==id);localSave(list);return {ok:true};
  }
  if(action==='locations')return {ok:true,locations:localLoadLocations()};
  if(['save_location','delete_location'].includes(action)&&!canManage)throw new Error('Bu işlem için yetkiniz yok.');
  if(action==='save_location'){
    let locs=localLoadLocations();const id=input.id?Number(input.id):0,name=String(input.name||'').trim(),location=String(input.location||'').trim(),note=String(input.note||'').trim();
    if(!name||!location)throw new Error('Konum adı ve konum bilgisi zorunludur.');
    if(id){const x=locs.find(z=>z.id===id);if(!x)throw new Error('Konum bulunamadı.');x.name=name;x.location=location;x.note=note;}
    else{const max=Math.max(0,...locs.map(z=>Number(z.id)||0));locs.push({id:max+1,name,location,note,created:new Date().toLocaleDateString('tr-TR')});}
    localSaveLocations(locs);return {ok:true};
  }
  if(action==='delete_location'){
    let locs=localLoadLocations();const id=Number(input.id),next=locs.filter(z=>z.id!==id);if(next.length===locs.length)throw new Error('Konum bulunamadı.');localSaveLocations(next);return {ok:true};
  }
  throw new Error('Geçersiz API isteği.');
}
function localLoadLocations(){
  try{const raw=localStorage.getItem(LOCAL_LOC_KEY);if(raw){const v=JSON.parse(raw);if(Array.isArray(v))return v;}}catch{}
  try{localStorage.setItem(LOCAL_LOC_KEY,JSON.stringify(DEFAULT_LOCATIONS))}catch{}
  return JSON.parse(JSON.stringify(DEFAULT_LOCATIONS));
}
function localSaveLocations(v){try{localStorage.setItem(LOCAL_LOC_KEY,JSON.stringify(v))}catch{}}
function mapsHref(value=''){
  const v=String(value||'').trim();
  if(/^https?:\/\//i.test(v)) return v;
  return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(v)+'&travelmode=driving';
}
function canManageLocations(){return !!currentUser && ['Yönetici','Müdür'].includes(currentUser.role)}
function updateModeBadge(){
  let el=document.getElementById('modeBadge');
  if(!el){el=document.createElement('div');el.id='modeBadge';el.style.cssText='position:fixed;right:14px;bottom:14px;z-index:99999;padding:8px 11px;border-radius:999px;font:700 11px Inter,system-ui;background:#132235;border:1px solid #31445d;color:#c9d6e5;box-shadow:0 8px 24px #0005';document.body.appendChild(el)}
  el.textContent='CİHAZ MODU';
  el.title='PHP gerektirmez. Kullanıcı ve konum kayıtları bu cihazın tarayıcısında saklanır.';
}
async function api(action, options={}){
  // PHP bağımlılığı kaldırıldı: tüm işlemler bu cihazın tarayıcı depolamasında çalışır.
  localMode=true;
  updateModeBadge();
  return localApi(action,options);
}

function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function initials(name){return (name||'?').trim().charAt(0).toUpperCase()}
function roleClass(role){return role==='Yönetici'?'role-admin':role==='Müdür'?'role-manager':'role-member'}
function toast(msg){alert(msg)}

async function refreshUsers(){
  if(!currentUser||currentUser.role==='Üye'){users=[];renderUsers();return;}
  try{
    const data=await api('users');
    users=Array.isArray(data.users)?data.users:[];
    renderUsers();
  }catch(err){
    users=[];renderUsers();
    console.error(err);
    toast('Kullanıcı listesi okunamadı: '+err.message);
  }
}

$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();
  $('loginError').textContent='';
  try{
    const data=await api('login',{method:'POST',body:JSON.stringify({username:$('loginUser').value.trim(),password:$('loginPass').value})});
    currentUser=data.user;
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    updateCurrentUserUI();
    applyRolePermissions();
    if(currentUser.role!=='Üye') await refreshUsers();
    await refreshLocations();
    showSection(currentUser.role==='Üye'?'locations':'dashboard');
    $('loginForm').reset();
  }catch(err){$('loginError').textContent=err.message;}
});
$('togglePass').onclick=()=>{const i=$('loginPass');i.type=i.type==='password'?'text':'password'};
$('logoutBtn').onclick=async()=>{try{await api('logout',{method:'POST',body:'{}'});}catch{}currentUser=null;users=[];appView.classList.add('hidden');loginView.classList.remove('hidden');$('loginError').textContent=''};

function updateDate(){const d=new Date();$('topDate').textContent=d.toLocaleDateString('tr-TR',{day:'2-digit',month:'long',year:'numeric'});$('topDay').textContent=d.toLocaleDateString('tr-TR',{weekday:'long'})} updateDate();

function renderUsers(){
  const q=$('userSearch').value.trim().toLowerCase(), rf=$('roleFilter').value;
  const filtered=users.filter(u=>(!q||u.username.toLowerCase().includes(q))&&(rf==='all'||u.role===rf));
  $('userTable').innerHTML=filtered.map(u=>`<tr>
    <td><div class="user-cell"><div class="user-avatar">${esc(initials(u.username))}</div><div class="user-meta"><strong>${esc(u.username)}</strong><small>ID: ${u.id}</small></div></div></td>
    <td><span class="badge ${roleClass(u.role)}">${esc(u.role)}</span></td>
    <td><span class="status ${u.status==='Aktif'?'active':'passive'}">${esc(u.status)}</span></td>
    <td>${esc(u.created)}</td>
    <td><div class="actions"><button class="action-btn edit" onclick="editUser(${u.id})" title="Düzenle">✎</button><button class="action-btn key" onclick="resetPassword(${u.id})" title="Şifre değiştir">⚿</button><button class="action-btn delete" onclick="deleteUser(${u.id})" title="Sil">⌫</button></div></td>
  </tr>`).join('')||`<tr><td colspan="5">Eşleşen kullanıcı bulunamadı.</td></tr>`;
  $('userCount').textContent=`Toplam ${filtered.length} kullanıcı gösteriliyor`;
  $('statTotal').textContent=users.length;
  $('statActive').textContent=users.filter(x=>x.status==='Aktif').length;
  $('statAdmin').textContent=users.filter(x=>x.role==='Yönetici').length;
  $('statMember').textContent=users.filter(x=>x.role==='Üye').length;
}
$('userSearch').addEventListener('input',renderUsers);$('roleFilter').addEventListener('change',renderUsers);

$('userForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const id=$('editId').value;
  const payload={id:id?Number(id):'',username:$('newUsername').value.trim(),password:$('newPassword').value,role:$('newRole').value,status:$('newStatus').value};
  try{
    await api('save_user',{method:'POST',body:JSON.stringify(payload)});
    resetForm();
    await refreshUsers();
    toast(id?'Kullanıcı güncellendi.':'Kullanıcı başarıyla eklendi.');
  }catch(err){toast(err.message)}
});
function resetForm(){$('userForm').reset();$('editId').value='';$('newPassword').required=true;$('newPassword').placeholder='Şifre giriniz';$('formTitle').textContent='Yeni Kullanıcı Ekle';$('saveUserBtn').textContent='Kullanıcıyı Kaydet';$('cancelEditBtn').classList.add('hidden')}
$('cancelEditBtn').onclick=resetForm;
window.editUser=id=>{const u=users.find(x=>x.id===id);if(!u)return;$('editId').value=u.id;$('newUsername').value=u.username;$('newPassword').value='';$('newPassword').required=false;$('newPassword').placeholder='Değiştirmeyecekseniz boş bırakın';$('newRole').value=u.role;$('newStatus').value=u.status;$('formTitle').textContent='Kullanıcıyı Düzenle';$('saveUserBtn').textContent='Değişiklikleri Kaydet';$('cancelEditBtn').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})};
window.resetPassword=async id=>{const u=users.find(x=>x.id===id);if(!u)return;const p=prompt(`${u.username} için yeni şifre:`);if(!p)return;try{await api('password',{method:'POST',body:JSON.stringify({id,password:p})});toast('Şifre güncellendi.')}catch(err){toast(err.message)}};
window.deleteUser=async id=>{const u=users.find(x=>x.id===id);if(!u)return;if(!confirm(`${u.username} kullanıcısını silmek istiyor musunuz?`))return;try{await api('delete_user',{method:'POST',body:JSON.stringify({id})});await refreshUsers();toast('Kullanıcı silindi.')}catch(err){toast(err.message)}};

function showSection(name){
  // Kullanıcılar menüsü artık boş ara sayfa yerine gerçek yönetim panelini açar.
  if(name==='users'){
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.section==='users'));
    const dash=$('section-dashboard');if(dash)dash.classList.add('active');
    if(currentUser&&currentUser.role!=='Üye') refreshUsers();
    $('sidebar').classList.remove('open');
    setTimeout(()=>document.querySelector('.dashboard-grid')?.scrollIntoView({behavior:'smooth',block:'start'}),30);
    return;
  }
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.section===name));
  const sec=$(`section-${name}`);if(sec)sec.classList.add('active');if(name==='locations')renderLocations();$('sidebar').classList.remove('open')
}
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>showSection(b.dataset.section));
document.querySelectorAll('[data-go-dashboard]').forEach(b=>b.onclick=()=>showSection('dashboard'));
$('menuBtn').onclick=()=>$('sidebar').classList.toggle('open');
document.addEventListener('click',e=>{if(innerWidth<=780&&!$('sidebar').contains(e.target)&&!$('menuBtn').contains(e.target))$('sidebar').classList.remove('open')});

function updateCurrentUserUI(){if(!currentUser)return;const profile=document.querySelector('.profile');if(profile){const avatar=profile.querySelector('.avatar'),strong=profile.querySelector('strong'),small=profile.querySelector('small');if(avatar)avatar.textContent=initials(currentUser.username);if(strong)strong.textContent=currentUser.username;if(small)small.textContent=currentUser.role;}}
function applyRolePermissions(){if(!currentUser)return;const canManage=currentUser.role==='Yönetici'||currentUser.role==='Müdür';document.querySelectorAll('[data-section="users"], [data-section="settings"]').forEach(el=>{el.style.display=canManage?'':'none'});const addPanel=document.querySelector('.add-panel');if(addPanel)addPanel.style.display=canManage?'':'none';const locAdd=$('openLocationForm');if(locAdd)locAdd.style.display=canManage?'':'none';const locRole=$('locationRole');if(locRole)locRole.textContent=canManage?'Ekle / Düzenle':'Görüntüle';}

async function restoreSession(){
  try{
    const data=await api('me');
    if(!data.user)return;
    currentUser=data.user;
    loginView.classList.add('hidden');appView.classList.remove('hidden');
    updateCurrentUserUI();applyRolePermissions();
    if(currentUser.role!=='Üye')await refreshUsers();
    await refreshLocations();
    showSection(currentUser.role==='Üye'?'locations':'dashboard');
  }catch(err){console.warn(err.message)}
}
restoreSession();

// Aynı site/origin açık olan diğer sekmelerde yapılan kullanıcı/konum değişikliklerini anında yansıt.
window.addEventListener('storage',e=>{
  if(e.key===LOCAL_KEY && currentUser && currentUser.role!=='Üye') refreshUsers();
  if(e.key===LOCAL_LOC_KEY && currentUser) refreshLocations();
});


async function refreshLocations(){
  try{const data=await api('locations');locations=data.locations||[];renderLocations();}catch(err){console.error(err);locations=[];renderLocations();}
}
function renderLocations(){
  const listEl=$('locationList');if(!listEl)return;
  const q=($('locationSearch')?.value||'').trim().toLocaleLowerCase('tr-TR');
  const filtered=locations.filter(x=>!q||`${x.name} ${x.location} ${x.note||''}`.toLocaleLowerCase('tr-TR').includes(q));
  $('locationTotal').textContent=locations.length;$('locationShown').textContent=filtered.length;
  $('locationEmpty').classList.toggle('hidden',filtered.length>0);
  const manage=canManageLocations();
  listEl.innerHTML=filtered.map(x=>`<article class="location-card">
    <div class="location-card-top"><div class="location-pin">⌖</div><div class="location-title"><h3>${esc(x.name)}</h3><span>#${x.id}</span></div></div>
    <div class="location-value">${esc(x.location)}</div>
    ${x.note?`<div class="location-note">${esc(x.note)}</div>`:''}
    <div class="location-actions">
      <a class="maps-btn" href="${esc(mapsHref(x.location))}" target="_blank" rel="noopener">⌖ Yol Tarifi</a>
      ${manage?`<button class="loc-edit" onclick="editLocation(${x.id})">Düzenle</button><button class="loc-delete" onclick="deleteLocation(${x.id})">Sil</button>`:''}
    </div>
  </article>`).join('');
}
$('locationSearch')?.addEventListener('input',renderLocations);

const geoBtn=$('getCurrentLocation');
const geoStatus=$('geoStatus');
function setGeoStatus(message,type=''){
  if(!geoStatus)return;
  geoStatus.textContent=message;
  geoStatus.classList.remove('success','error');
  if(type)geoStatus.classList.add(type);
}
geoBtn?.addEventListener('click',()=>{
  if(!canManageLocations())return toast('Bu işlem için Admin veya Müdür yetkisi gerekir.');
  if(!('geolocation' in navigator)){
    setGeoStatus('Bu cihaz/tarayıcı konum alma özelliğini desteklemiyor.','error');
    return;
  }
  // Modern tarayıcılar gerçek web sitesinde HTTPS ister. Localhost istisnadır.
  const isLocalHost=['localhost','127.0.0.1','::1'].includes(location.hostname);
  if(location.protocol==='http:'&&!isLocalHost){
    setGeoStatus('Konum almak için siteyi HTTPS (kilit işaretli) olarak açın.','error');
    return;
  }
  geoBtn.disabled=true;
  const oldText=geoBtn.textContent;
  geoBtn.textContent='📍 Konum alınıyor...';
  setGeoStatus('GPS konumunuz belirleniyor. Lütfen konum iznine izin verin.');
  navigator.geolocation.getCurrentPosition(pos=>{
    const lat=Number(pos.coords.latitude).toFixed(7);
    const lng=Number(pos.coords.longitude).toFixed(7);
    const mapsUrl=`https://www.google.com/maps?q=${lat},${lng}`;
    const input=$('locationValue');
    if(input){input.value=mapsUrl;input.dispatchEvent(new Event('input',{bubbles:true}));}
    const accuracy=Math.round(pos.coords.accuracy||0);
    setGeoStatus(`Konum alındı ✓  ${lat}, ${lng}${accuracy?` · yaklaşık ±${accuracy} m`:''}`,'success');
    geoBtn.disabled=false;geoBtn.textContent=oldText;
  },err=>{
    let msg='Konum alınamadı.';
    if(err.code===1)msg='Konum izni reddedildi. Tarayıcı ayarlarından konum iznini açın.';
    else if(err.code===2)msg='Cihaz konumu belirleyemedi. GPS/Konum servisinin açık olduğundan emin olun.';
    else if(err.code===3)msg='Konum alma işlemi zaman aşımına uğradı. Tekrar deneyin.';
    setGeoStatus(msg,'error');
    geoBtn.disabled=false;geoBtn.textContent=oldText;
  },{enableHighAccuracy:true,timeout:15000,maximumAge:0});
});
$('openLocationForm')?.addEventListener('click',()=>{if(!canManageLocations())return;resetLocationForm();$('locationFormPanel').classList.remove('hidden');$('locationName').focus();});
$('closeLocationForm')?.addEventListener('click',()=>{$('locationFormPanel').classList.add('hidden');resetLocationForm();});
$('cancelLocationEdit')?.addEventListener('click',()=>{$('locationFormPanel').classList.add('hidden');resetLocationForm();});
function resetLocationForm(){$('locationForm')?.reset();if($('locationEditId'))$('locationEditId').value='';if($('locationFormTitle'))$('locationFormTitle').textContent='Yeni Konum Ekle';}
$('locationForm')?.addEventListener('submit',async e=>{
  e.preventDefault();if(!canManageLocations())return toast('Bu işlem için yetkiniz yok.');
  const payload={id:$('locationEditId').value?Number($('locationEditId').value):'',name:$('locationName').value.trim(),location:$('locationValue').value.trim(),note:$('locationNote').value.trim()};
  try{await api('save_location',{method:'POST',body:JSON.stringify(payload)});await refreshLocations();$('locationFormPanel').classList.add('hidden');resetLocationForm();toast(payload.id?'Konum güncellendi.':'Konum eklendi.');}catch(err){toast(err.message)}
});
window.editLocation=id=>{if(!canManageLocations())return;const x=locations.find(z=>z.id===id);if(!x)return;$('locationEditId').value=x.id;$('locationName').value=x.name;$('locationValue').value=x.location;$('locationNote').value=x.note||'';$('locationFormTitle').textContent='Konumu Düzenle';$('locationFormPanel').classList.remove('hidden');$('locationName').focus();};
window.deleteLocation=async id=>{if(!canManageLocations())return;const x=locations.find(z=>z.id===id);if(!x||!confirm(`“${x.name}” konumunu silmek istiyor musunuz?`))return;try{await api('delete_location',{method:'POST',body:JSON.stringify({id})});await refreshLocations();}catch(err){toast(err.message)}};

document.querySelectorAll('[data-mobile-section]').forEach(btn=>btn.addEventListener('click',()=>showSection(btn.dataset.mobileSection)));
document.getElementById('mobileLogout')?.addEventListener('click',()=>document.getElementById('logoutBtn')?.click());
function syncMobileRoleNav(){const el=document.querySelector('.mobile-users');if(el)el.style.display=currentUser&&currentUser.role!=='Üye'?'grid':'none'}
const _oldApplyRolePermissions=applyRolePermissions;
applyRolePermissions=function(){_oldApplyRolePermissions();syncMobileRoleNav();};
