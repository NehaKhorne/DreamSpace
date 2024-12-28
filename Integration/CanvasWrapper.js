var loadStatus = false;
var loginStatus = false;
var canvasReady = false;
var canvasFocusState = "1";
var loadedFloorDesignId;
var onLoadFn;
var gameInstance;
var localUnityContent;
var rome_action_id, rome_action, project_id, design_id, theme_id;
var design_action_id,
  design_action_type,
  designApplyTrigger = false;
var width, height;
var webglLoginRequest = false;
var curentUserSession;
var curentUserPreferences;
var clickedProductId, clickedTemplateId, clickedRoomThemeId;
var selectedRoom,
  room_type,
  room_data = [],
  selected_room_name = "";
var uuid;
var initial_timestamp;
var asset_download_timestamp,
  screenChangeCount = 0;
var canvas_ready_timestamp;
var app_ready_timestamp;
var tryButtons = [];
var allFloorData = [];
var assetCdnUrls = [];
var uniqe_key = null;
var consumerFlowEnabled = null;
var consumerFlowType = null;
var clickDelay = false;
var previousScrollPos;
var render_id = null;
var render_uri = null;
var timerId;
var animationTimer;
var systemCheckTimer;
var systemCheckLoadTimer;
var overrideRoute;
// To handle WebGL canvas key inputs focus

document.addEventListener("mousedrag", function (e) {
  e.preventDefault();
});

document.addEventListener("click", function (e) {
  if (e.target.id === "unity-canvas-1") {
    // Clicked on canvas
    FocusCanvas("1");
  } else {
    // Clicked outside of canvas
    FocusCanvas("0");
  }
});

function FocusCanvas(focus) {
  if (canvasReady && canvasFocusState != focus && loadStatus) {
    this.localUnityContent.send("RomeManager", "FocusCanvas", focus);
    canvasFocusState = focus;
  }
}

function ChangeCanvasQuality(value) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "ChangeQuality", value);
  }
}

function RomeCanvasReady() {
  canvas_ready_timestamp = Date.now();
  setTimeout(
    this.localUnityContent.send(
      "RomeManager",
      "SetServerType",
      window.env_server_type
    ),
    1000
  );

  GATiming(
    "RomeApp",
    "CanvasRender",
    canvas_ready_timestamp - asset_download_timestamp
  );
  canvasReady = true;
  window.baseLayout.UpdateCanvasReadyState();
}

function productLoad(id) {
  if (loadStatus) {
    window.GAEvent("Catalog", "ProductClick", "", id);
    clickedProductId = id;
    this.localUnityContent.send("RomeManager", "OnProductClick", parseInt(id));
  }
}

window.addEventListener("keyup", (event) => {
  if (event.keyCode === 27) {
    if (loadStatus) {
      this.localUnityContent.send("RomeManager", "OnEscape");
    }
  }
});

function OnEscape() {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "OnEscape");
  }
}

function paintLoad(id, hexaDecimal) {
  if (loadStatus) {
    window.GAEvent("Catalog", "PaintClick", "", hexaDecimal);
    this.localUnityContent.send(
      "RomeManager",
      "OnPaintClick",
      JSON.stringify({ finish_id: id, hex: hexaDecimal })
    );
  }
}

function paintLoadWithJson(data) {
  if (loadStatus) {
    window.GAEvent("Catalog", "PaintClick", "", data);
    this.localUnityContent.send("RomeManager", "OnPaintClick", data);
  }
}

function finishLoad(id) {
  if (loadStatus) {
    window.GAEvent("Catalog", "FinishClick", "", id);
    this.localUnityContent.send("RomeManager", "OnFinishClick", parseInt(id));
  }
}

function dimmerSwitch(value) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "DimLights", value);
  }
}
function switchFans(value) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "SwitchFansPresets", value);
  }
}
function switchFansOverride(value) {
  if (loadStatus) {
    this.localUnityContent.send(
      "RomeManager",
      "SwitchFansPresetsOverride",
      value
    );
  }
}
function switchMediaControls(value) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "SwitchMediaControls", value);
  }
}
function switchMediaControlsOverride(value) {
  if (loadStatus) {
    this.localUnityContent.send(
      "RomeManager",
      "SwitchMediaControlsOverride",
      value
    );
  }
}
function curtain(value) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "ToggleCurtains", value);
  }
}
function lightEffects(value) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "ToggleLightEffects", value);
  }
}
function toggleAC(value) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "ToggleAC", value);
  }
}
function fanOnOff(value) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "SwitchFanOnOff", value);
  }
}
function freeScaleProduct(){

  if (loadStatus) {
  this.localUnityContent.send("RomeManager", "FreeScaleProduct",);
  }    

  }

function templateLoad(id) {
  if (loadStatus) {
    window.GAEvent("Catalog", "TemplateClick", "", id);
    window.clickedTemplateId = id;
    this.localUnityContent.send(
      "RomeManager",
      "OnKitchenTemplateClick",
      parseInt(id)
    );
  }
}

// function roomThemeLoad(themeId, roomType) {
//     if (loadStatus && !clickDelay) {

//         clickDelay = true;
//         window.GAEvent("Catalog", "RoomThemeClick", "", id)
//         this.localUnityContent.send("RomeManager", "OnRoomThemeClick", JSON.stringify({ type: roomType, id: parseInt(themeId), uuid: "" }));
//         setTimeout(() => {
//             clickDelay = false;
//         }, 500);
//     }
// }

function roomThemeLoad(id) {
  if (loadStatus && !clickDelay) {
    clickDelay = true;
    window.GAEvent("Catalog", "RoomThemeClick", "", id);
    this.localUnityContent.send(
      "RomeManager",
      "OnRoomThemeClick",
      JSON.stringify({ type: "", id: parseInt(id), uuid: "" })
    );
    setTimeout(() => {
      clickDelay = false;
    }, 500);
  }
}
function roomThemeVariantLoad(id, uid) {
  window.GAEvent(
    "Catalog",
    "RoomThemeVariantClick",
    id.toString(),
    uid.toString()
  );
  this.localUnityContent.send(
    "RomeManager",
    "OnRoomThemeVariantClick",
    JSON.stringify({ type: "", id, variant_uid: uid })
  );
}

function startFusion(id) {
  this.localUnityContent.send(
    "RomeManager",
    "OnAutoThemeGenerateClick",
    JSON.stringify({ id: id })
  );
}

function UnknownProductPositions(json_data) {
  window.catalogComponent.unknownProductPositions(json_data);
}

function AllFloorData(json_data) {
  //console.log("LoadProjectFloorsData");
  // alert("here")
  window.allFloorData = json_data;
  window.webgl.LoadFloorsData(json_data);
}

function LoadSelectedFloor(projectId, floorId, designId) {
  var json_data = JSON.stringify({
    floor_id: floorId,
    design_id: designId,
    project_id: projectId,
  });

  this.localUnityContent.send("RomeManager", "LoadFloor", json_data);
}

function LoadFloorDesign(floorDesignId) {
  if (loadStatus) {
    // Reset the canvas before data load
    var json_data = JSON.stringify({ uuid: floorDesignId });
    this.localUnityContent.send("RomeManager", "LoadFloorDesign", json_data);
  }
}

function LoadPlaygroundDemo(floorDesignId) {
  if (loadStatus) {
    var json_data = JSON.stringify({ uuid: floorDesignId });
    this.localUnityContent.send("RomeManager", "LoadFloorDesign", json_data);
  }
}

function RoomData(room_data) {
  clearRoomData();
  // console.log(room_data);
  // Adding verified status
  room_data.forEach(function (data, index) {
    data.status = false;
    data.roomName = data.roomName.split(" - ")[0].trim();
    data.status = Boolean(Number(data.roomStatus));
  });

  window.room_data = room_data;
  // window.webgl.setState({ received_room_data: true })
  window.floorplanVerification &&
    window.floorplanVerification.setState({ received_room_data: true });

  window.webgl.LoadRoomsBar();
}

function clearRoomData() {
  window.room_data = [];
  window.allFloorData = [];
  if (window.webgl) {
    window.webgl.resetRoomsData();
    window.webgl.resetActiveProjectDetails();
    ResetProductDownloadProgress();
    window.webgl.setState({ received_room_data: false });
  }
}

function ResetProductDownloadProgress() {
  window.webgl.setAppltDesignState(false);
}

function applyFinish(url) {
  if (loadStatus) {
    window.GAEvent("Catalog", "ApplyFinish", url);
    this.localUnityContent.send("RomeManager", "ApplyFinish", url);
  }
}

//To be Called After clicking on Save in "RomeApp"
function PromptProjectCreate() {
  if(window?.isNewSystemCheck){
    window.OnProjectCreate("My first home on SB", "My First Design")
    window.isNewSystemCheck = false;
  }
  else{
    if (loadStatus && loginStatus) {
      window.GAEvent("RomeApp", "ProjectCreate", "");
      window.headerComponent.OnProjectCreate();
    }
  }
}

function OnAppReady() {
  app_ready_timestamp = Date.now();
  loadStatus = true;
  if (curentUserSession) {
    UpdateUserLogin(curentUserSession);
  }
  // TODO:SD New callback
  window.canvasWrapper.onCanvasReadyCallback();

  // if (rome_action == "OnScaleRoomClick") {
  //     OnScaleRoom(rome_action_id);
  // }

  // else if (rome_action == "LoadDesign") {
  //     // this.localUnityContent.send("RomeManager", "LoadDesign", JSON.stringify({ proj_id: parseInt(project_id), design_id: parseInt(design_id) }));
  //     window.LoadDesign(project_id, design_id)
  // }
  // else if (rome_action == "LoadFloorDesign") {
  //     window.LoadFloorDesign(rome_action_id)
  //     // this.localUnityContent.send("RomeManager", "LoadDesign", JSON.stringify({ proj_id : parseInt(project_id) , design_id : parseInt(design_id)}));
  // }

  // else if (rome_action == "LoadFloorplanProjectSetup") {
  //     //  this.localUnityContent.send("RomeManager", JSON.stringify (rome_action) );
  //     this.localUnityContent.send("RomeManager", "LoadFloorplanSetup");
  //     window.LoadFpVerification(JSON.stringify(rome_action_id));
  // } else if (rome_action == "LoadFloorplanSetup") {
  //     this.localUnityContent.send("RomeManager", "LoadFloorplanSetup");
  //     window.LoadFpVerificationId(parseInt(rome_action_id));
  // }
  // else if (rome_action == "OnFloorplanClick") {
  //     this.localUnityContent.send("RomeManager", rome_action, parseInt(rome_action_id));
  //     if (theme_id) {
  //         if (room_type == "Kitchen")
  //             templateLoad(theme_id)
  //         else
  //             roomThemeLoad(theme_id);
  //     }
  // }
  // else if (rome_action == "OnFloorplanClickByUUID") {
  //     this.localUnityContent.send("RomeManager", rome_action, rome_action_id);
  //     if (theme_id) {
  //         if (room_type == "Kitchen")
  //             templateLoad(theme_id)
  //         else
  //             roomThemeLoad(theme_id);
  //     }
  // }
  // else if (rome_action == "LoadDemoFloorDesign") {
  //     this.localUnityContent.send("RomeManager", rome_action, parseInt(rome_action_id));
  // }
  // else if (rome_action == "LoadPlayground") {
  //     window.LoadPlaygroundDemo(rome_action_id)
  //     // this.localUnityContent.send("RomeManager", rome_action, parseInt(rome_action_id));
  // }
  // else if (rome_action == "OnProjectClick" || rome_action == "LoadProject") {
  //     // this.localUnityContent.send("RomeManager", "OnProjectClick", parseInt(rome_action_id));
  //     ProjectLoad(parseInt(rome_action_id));
  //     if (theme_id) {
  //         if (room_type == "Kitchen")
  //             templateLoad(theme_id)
  //         else
  //             roomThemeLoad(theme_id);
  //     }
  // }

  // setTimeout(() => {
  //     WaitForCanvasReady();
  // }, 4000);

  // window.webgl.loadingDone();
}

function WaitForCanvasReady() {
  if (window.webgl.getApplyDesignState()) {
    setTimeout(() => {
      canvasReadyCallBack();
    }, 2000);
  } else {
    setTimeout(WaitForCanvasReady, 1000); // try again in 300 milliseconds
  }
}

function canvasReadyCallBack() {
  if (window.webgl.getApplyDesignState()) {
    window.canvasWrapper.OnWaitForCanvasReady();
  } else {
    WaitForCanvasReady(); // try again in 300 milliseconds
  }
}

function OnLoadSavedDesign() {
  if (curentUserSession != null || curentUserSession != undefined) {
    UpdateUserLogin(curentUserSession);
  }

  if (window.curentUserPreferences !== undefined) {
    window.project_id = window.curentUserPreferences.playground_project;
    window.design_id = window.curentUserPreferences.playground_design;
    this.localUnityContent.send(
      "RomeManager",
      "LoadDesign",
      JSON.stringify({
        proj_id: parseInt(window.project_id),
        design_id: parseInt(window.design_id),
      })
    );
  }
}

function ProjectLoad(projectId, floorId = -1, designId = -1) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "ProjectLoad", "", projectId);
    this.localUnityContent.send(
      "RomeManager",
      "OnProjectClick",
      JSON.stringify({
        project_id: projectId,
        floor_id: floorId,
        design_id: designId,
      })
    );
  }

  // this.localUnityContent.send("RomeManager", rome_action, parseInt(projectId));
  // this.localUnityContent.send("RomeManager", "OnProjectClick", parseInt(projectId));
}

function LoadDesign(project_id, design_id) {
  if (loadStatus) {
    // Reset the canvas before data load
    window.GAEvent("RomeApp", "DesignLoad", "", design_id);
    this.localUnityContent.send(
      "RomeManager",
      "LoadDesign",
      JSON.stringify({
        proj_id: parseInt(project_id),
        design_id: parseInt(design_id),
      })
    );
  }
}

function FloorplanLoad(id) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "FloorplanLoad", "", id);

    this.localUnityContent.send(
      "RomeManager",
      "OnFloorplanClick",
      parseInt(id)
    );
  }
}
function FloorplanLoadByUUID(uuid) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "FloorplanLoadByUUID", "", uuid);
    this.localUnityContent.send("RomeManager", "OnFloorplanClickByUUID", uuid);
  }
}

function ThemeLoad(id) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "ThemeLoad", "", id);
    this.localUnityContent.send("RomeManager", "OnThemeClick", parseInt(id));
  }
}

function OnLogin() {
  if (canvasReady) {
    window.GAEvent("RomeApp", "Login", "", "");
    this.localUnityContent.send("RomeManager", "OnLogin");
  }
}

function OnLogout() {
  curentUserSession = null;
  curentUserPreferences = null;
  loginStatus = false;

  if (canvasReady) {
    window.GAEvent("RomeApp", "LogOut", "", "");
    this.localUnityContent.send("RomeManager", "OnLogout");
  }
}

function OnProjectCreate(projectName, designName) {
  var args = [projectName, designName];
  if (loadStatus) {
    window.GAEvent("RomeApp", "ProjectCreate", "");
    this.localUnityContent.send(
      "RomeManager",
      "OnProjectCreate",
      JSON.stringify(args)
    );
    if(window.merchantName==="rustomjee" && window.isMerchant && window.floorDesign!== undefined && window.floorDesign!== null) {
      window.headerComponent.OnSave();
    }
  }
}

function changeProfileHandlers(applyToAll, profileType) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "ProjectCreate", "");
    this.localUnityContent.send(
      "RomeManager",
      "ChangeProfileHandlers",
      JSON.stringify({
        ApplyToAll: applyToAll,
        ProfileType: profileType,
      })
    );
  }
}

function OnScaleRoom(formData) {
  var args = Array.from(formData.values());
  if (loadStatus) {
    window.GAEvent("RomeApp", "ScaleableRoomCreate", "", formData);
    this.localUnityContent.send(
      "RomeManager",
      "OnScaleRoomClick",
      JSON.stringify(args.map(String))
    );
  } else {
    rome_action_id = formData;
    rome_action = "OnScaleRoomClick";
  }
}

function ChangeFloorplan(id) {
  if (loadStatus) {
    window.GAEvent("RomeAp", "ChangeFloorplanClick", "", id);
    this.localUnityContent.send("RomeManager", "ChangeFloorplan", parseInt(id));
  }
}

function CycleRoom(uuid) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "Cycle Rooms", "", uuid);
    this.localUnityContent.send("RomeManager", "CycleRoom", uuid);

    // window.canvasWrapper.OnRoomSwitch(uuid)
  }
}

function CycleRoomDoubleClick(uuid) {
  const obj = JSON.parse(uuid);
  window.DoubleClickRoomSwitchDone = true;
  window.selectedRoom = obj[0].roomUID;
}

function PromptUserLogin() {
  if (loadStatus) {
    window.GAEvent("RomeApp", "ClickOnSaveWithoutLogin", "");
  }
  window.headerComponent.OnLoginClick();
  webglLoginRequest = true;
}

function UpdateUserLogin(userSession) {
  if (loadStatus && userSession) {
    loginStatus = true;
    window.GAEvent("Login", "UpdateUserSession", "", userSession.user_id);
    this.localUnityContent.send(
      "RomeManager",
      "UpdateUser",
      JSON.stringify(userSession)
    );
  }
}

function AfterUserLogin(userSession) {
  if (loadStatus && userSession) {
    loginStatus = true;
    window.GAEvent("RomeApp", "AfterUserLogin", "", userSession.user_id);
    this.localUnityContent.send(
      "RomeManager",
      "OnLogin",
      JSON.stringify(userSession)
    );
  }
}

function GetProductVariant(productId) {
  if (loadStatus) {
    window.GAEvent("Catalog", "ProductVariantClick", "", productId);
    this.localUnityContent.send(
      "RomeManager",
      "GetProductVariants",
      parseInt(productId)
    );
  }
}

function muteUnMute() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "MuteOrUnMute", "");
    this.localUnityContent.send("RomeManager", "MuteOrUnMute");
  }
}

function PromptProductVariants(variants) {
  window.designsComponent.after_product_variants(variants);
}

function OnOldScreenShot(image_url) {
  // window.headerComponent.trigger_snapshot_download();
  // console.log(image_url);
  // document.getElementById("snapshot_download_widget").getElementsByTagName("a")[0].href = image_url;
}

function miniCanvas(bool) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "Minimized", "", bool);
    this.localUnityContent.send("RomeManager", "IsMiniCanvas", bool);
  }
}

function escKey(event) {
  if (event.keyCode == 27) {
    if (document.getElementsByClassName("col-active")[0])
      window.catalogComponent.setState({ style: "col-inactive" });
    if (document.getElementsByClassName("scroll-container active")[0])
      window.catalogComponent.setState({ webgl_dialog: "inactive" });
  }
}

function closedropdown() {
  if (document.getElementsByClassName("user-dropdown")[0])
    window.headerComponent.setState({ dropdown: "user-dropdown hide" });
}

// PLAYBAR

function brightness(level) {
  if (loadStatus) {
    window.GAEvent("PlayBar", "Brightness", "", level);
    this.localUnityContent.send("RomeManager", "SetLightState", level);
  }
}

function UpdateLight(brightnessLevel) {
  if (brightnessLevel == 0) brightnessLevel = 4;
  else brightnessLevel--;

  window.playBar.brightness({ id: brightnessLevel });
}

function playPauseAutoRotate() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "PlayPause", "");
    this.localUnityContent.send("RomeManager", "PlayPauseAutoRotate");
  }
}

function redo() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "Redo", "");
    this.localUnityContent.send("RomeManager", "Redo");
  }
}
function undo() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "Undo", "");
    this.localUnityContent.send("RomeManager", "Undo");
  }
}

function topView() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "TopView", "");
    this.localUnityContent.send("RomeManager", "TopView");
  }
}

function walkThrough() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "WalkThrough", "");
    this.localUnityContent.send("RomeManager", "WalkThrough");
  }
}

function flymode() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "Flymode", "");
    this.localUnityContent.send("RomeManager", "Flymode");
  }
}

function prev() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "Prev", "");
    this.localUnityContent.send("RomeManager", "PreviousRoom");
  }
}

function next() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "Next", "");
    this.localUnityContent.send("RomeManager", "NextRoom");
  }
}

function crossSectionOn() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "CrossSectionOn", "");
    this.localUnityContent.send("RomeManager", "CrossSectionOn");
  }
}

function crossSectionOff() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "CrossSectionOff", "");
    this.localUnityContent.send("RomeManager", "CrossSectionOff");
  }
}

function rotateHome(value) {
  if (loadStatus) {
    window.GAEvent("PlayBar", "RotateHome", "");
    this.localUnityContent.send("RomeManager", "SendPlaybarValue", value);
  }
}

function ReceivePlaybarValue(value) {
  if (loadStatus) {
    window.GAEvent("PlayBar", "RotateHome", "", value * 100);
    window.playBar.rotationValueFromCanvas(value * 100);
  }
}

function removeLightMap() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "RemoveLightMap", "");
    this.localUnityContent.send("RomeManager", "RemoveLightMap");
  }
}

//Rotation

function SwingLeft() {
  if (loadStatus) {
    window.GAEvent("RomeApp", "SwingLeft", "");
    this.localUnityContent.send("RomeManager", "SwingLeft");
  }
}

function SwingRight() {
  if (loadStatus) {
    window.GAEvent("RomeApp", "SwingRight", "");
    this.localUnityContent.send("RomeManager", "SwingRight");
  }
}

function RotateLeftSmooth() {
  if (loadStatus) {
    window.GAEvent("RomeApp", "RotateLeftSmooth", "");
    this.localUnityContent.send("RomeManager", "RotateLeftSmooth");
  }
}

function RotateRightSmooth() {
  if (loadStatus) {
    window.GAEvent("RomeApp", "RotateRightSmooth", "");
    this.localUnityContent.send("RomeManager", "RotateRightSmooth");
  }
}

// Rome To Canvas

function screenshot() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "Screenshot", "");
    this.localUnityContent.send("RomeManager", "Screenshot");
  }
}

function paidScreenshot() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "PaidScreenshot", "");
    this.localUnityContent.send("RomeManager", "ScreenshotRender", "1");
  }
}

function shareScreenshot() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "ShareScreenshot", "");
    this.localUnityContent.send("RomeManager", "OnScreenShotResponse");
  }
}

function OnScreenShotResponse(data) {
  window.headerComponent.onUpdateBoltAiSnapshostRenderId(data.data.render_id);
  window.render_id = data.data.render_id;
  window.render_uri = data.data.render_uri;
  window.share_uri = data.data.share_uri;
}

function CurrentRoomProducts(data) {}

function OnRestyleClick(data) {}

function exportArtefact(type = "2") {
  if (loadStatus) {
    window.GAEvent("PlayBar", "PaidScreenshot", "");
    this.localUnityContent.send("RomeManager", "ScreenshotRender", type);
  }
}

function Randomizer() {
  this.localUnityContent.send("RomeManager", "OnAutoThemeGenerateClick", "");
}

function viewPanorama() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "ViewPanorama", "");
    this.localUnityContent.send("RomeManager", "RenderPanorama");
  }
}

function loadLightMap() {
  if (loadStatus) {
    window.GAEvent("PlayBar", "LoadLightMap", "");
    this.localUnityContent.send("RomeManager", "LoadLightMap");
  }
}

function getFpVerificationParams(uuid, name = null, type = null, auto = "0") {
  let data = {};
  data["uuid"] = uuid;
  if (name != null) {
    data["name"] = name;
  }
  if (type != null) {
    data["type"] = type;
  }
  data["auto"] = auto.toString();
  return JSON.stringify(data);
}

function fpVerificationSelectRoom(uuid) {
  if (loadStatus) {
    let data = getFpVerificationParams(uuid, null, null, 0);
    this.localUnityContent.send("RomeManager", "FloorplanSelectRoom", data);
  }
}

function fpVerificationUpdateRoom(uuid, name = null, type = null) {
  if (loadStatus) {
    let data = getFpVerificationParams(uuid, name, type, 1);
    this.localUnityContent.send("RomeManager", "FloorplanUpdateRoom", data);
    return JSON.parse(data);
  }
}

function fpVerificationAddRoom(name, type = null) {
  if (loadStatus) {
    uuid = GetUniqueKey();
    let data = getFpVerificationParams(uuid, name, type, 1);
    this.localUnityContent.send("RomeManager", "FloorplanAddRoom", data);
    return JSON.parse(data);
  }
}

function fpVerificationRemoveRoom(uuid) {
  if (loadStatus) {
    let data = getFpVerificationParams(uuid, null, null, 1);
    this.localUnityContent.send("RomeManager", "FloorplanRemoveRoom", data);
  }
}

function fpScaleSelectRoomForFloorplanScale() {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "SelectRoomForFloorplanScale");
  }
}

function fpScaleShowSelectedRoomScale(unit = null) {
  if (loadStatus) {
    if (unit == null) {
      unit = "feet";
    }
    var json_data = JSON.stringify({ unit: unit });
    this.localUnityContent.send(
      "RomeManager",
      "ShowSelectedRoomScale",
      json_data
    );
  }
}

function fpScaleCorrectScaleFloorplan() {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "CorrectScaleFloorplan");
  }
}

function fpGetFloorplanHeight(unit) {
  if (loadStatus) {
    var json_data = JSON.stringify({ unit: unit });
    this.localUnityContent.send("RomeManager", "GetFloorplanHeight", json_data);
  }
}

function UpdateFloorplanHeight(height, unit) {
  // console.log("UpdateFloorplanHeight");
  if (loadStatus) {
    var json_data = JSON.stringify({ length: height.toString(), unit: unit });
    // console.log(json_data);
    window.GAEvent("RomeApp", "UpdateFloorplanHeight", "");
    this.localUnityContent.send(
      "RomeManager",
      "UpdateFloorplanHeight",
      json_data
    );
  }
}

function CurrentFloorplanHeight(json_data) {
  // console.log("CurrentFloorplanHeight");
  // console.log(json_data);
  window.floorplanRoomScale.updateRoomHeight(json_data);
}

function CurrentRoomScale(json_data) {
  // console.log("CurrentFloorplanHeight");
  // console.log(json_data);
  window.floorplanRoomScale.updateRoomscale(json_data);
}

function fpGetFloorplanUrl() {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "GetFloorplanUrl");
  }
}

function CurrentFloorplanUrl(json_data) {
  // console.log(json_data);
  window.currentFloorplanData = json_data;
}

function CorrectFloorplanScale(height, unit) {
  // console.log("CorrectFloorplanScale");

  if (loadStatus) {
    window.GAEvent("RomeApp", "CorrectFloorplanScale", "");
    var json_data = JSON.stringify({ length: height.toString(), unit: unit });
    // console.log(json_data);
    this.localUnityContent.send(
      "RomeManager",
      "CorrectFloorplanScale",
      json_data
    );
  }
}

function fpEnableFloorSelection() {
  if (loadStatus) {
    window.GAEvent("RomeApp", "fpEnableFloorSelection", "");
    this.localUnityContent.send("RomeManager", "EnableFloorSelection");
  }
}

function GetUniqueKey() {
  uuid = null;
  if (window.uniqe_key == null) {
    this.localUnityContent.send("RomeManager", "FloorplanNewUniqueKey");
  }

  uuid = window.uniqe_key;
  window.uniqe_key = null;
  this.localUnityContent.send("RomeManager", "FloorplanNewUniqueKey");

  return uuid;
}

function PrepareUniqueKey() {
  this.localUnityContent.send("RomeManager", "FloorplanNewUniqueKey");
}

function LoadFpVerification(data) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "LoadProjectForVerification", "");
    setTimeout(function () {
      this.localUnityContent.send(
        "RomeManager",
        "LoadProjectForVerification",
        data
      );
    }, 3000);
  }
}
function LoadFloorplanSetup(data) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "LoadFloorplanSetup");
  }
}

function LoadFpVerificationId(id) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "LoadFloorplanSetup", "", id);
    setTimeout(function () {
      this.localUnityContent.send(
        "RomeManager",
        "LoadFloorplanForVerification",
        parseInt(id)
      );
    }, 1000);
    // this.localUnityContent.send("RomeManager", "LoadFloorplanForVerification", parseInt(id));
  }
}

function OnLoadFloor(floor_id, design_id, project_id) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "FloorLoadForDesign", "", design_id);
    var json_data = JSON.stringify({
      floorplan_number: floor_id,
      design_id: design_id,
      proj_id: project_id,
    });
    // console.log(json_data);
    this.localUnityContent.send("RomeManager", "LoadFloor", json_data);
  }
}

function OnPanHorizontal(direction = 1) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "OnPanHorizontal", "");
    this.localUnityContent.send(
      "RomeManager",
      "PanHorizontal",
      parseInt(direction)
    );
  }
}

function OnPanVertical(direction = 1) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "OnPanVertical", "");
    this.localUnityContent.send(
      "RomeManager",
      "PanVertical",
      parseInt(direction)
    );
  }
}

function OnZoom(direction = 1) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "OnZoom", "");
    this.localUnityContent.send("RomeManager", "Zoom", parseInt(direction));
  }
}

function OnHideDesignDropdown(status = 0) {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "ToggleDesignDropdown", status);
  }
}

function LoadDesignScene(id) {
  if (loadStatus) {
    window.GAEvent("RomeApp", "LoadRomeScene", "", parseInt(id));
    this.localUnityContent.send("RomeManager", "LoadRomeScene", parseInt(id));
    setTimeout(function () {
      this.localUnityContent.send(
        "RomeManager",
        "OnFloorplanClick",
        parseInt(id)
      );
    }, 1000);
  }
}

function fpVerificationSaveScene() {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "FloorplanSave");
  }
}
function enableDisableRoomDimensions(param) {
  if (loadStatus) {
    // console.log("room dimesion", param);
    this.localUnityContent.send(
      "RomeManager",
      "EnableDisableRoomDimensions",
      parseInt(param)
    );
  }
}

// Canvas To Rome

function OnScreenShot(image_url) {
  window.headerComponent.trigger_snapshot_download();
  document
    .getElementById("snapshot_download_widget")
    .getElementsByTagName("img")[0].src = image_url;
  if(document.getElementById("snapshot_download_widget").getElementsByTagName("a")[0]){;
    document
    .getElementById("snapshot_download_widget")
    .getElementsByTagName("a")[0].href = image_url;
  }
}

function OnRenderImages(image_url) {
  var imgs = JSON.parse(image_url).urls;
  window.headerComponent.trigger_snapshot_download();
  document
    .getElementById("snapshot_download_widget")
    .getElementsByTagName("img")[0].src = imgs[0];
  document
    .getElementById("snapshot_download_widget")
    .getElementsByTagName("a")[0].href = imgs[0];
}

function OnRenderPanorama(image_url) {
  var imgs = JSON.parse(image_url);
  uuid = imgs.uuid;
  window.headerComponent.openPanorama();
  //document.getElementById("snapshot_download_widget").getElementsByTagName("a")[0].href = imgs[0];
}

function OnNextOrPrev(roomUUID) {
  window.CycleRoom(roomUUID);
  window.selected_room_name = document.getElementById(roomUUID).innerText;
  if (document.getElementsByClassName("active-room")[0] !== undefined) {
    let selectedData = document.getElementsByClassName("active-room");
    while (selectedData.length) {
      selectedData[0].classList.remove("active-room");
    }
  }

  document.getElementById(roomUUID).classList.add("active-room");
}

function save() {
  if (loadStatus) {
    //document.getElementById("save-button").setAttribute('disabled',true)
    // TODO: SD Login status needs to be updated
    if (true) {
      window.GAEvent("PlayBar", "Save", "");
      this.localUnityContent.send("RomeManager", "Save");
    } else {
      window.headerComponent.OnOtpLogin();
    }
  }
}

// Enable Buttons

function enableSave() {
  if (loadStatus) {
    document.getElementById("save-button").removeAttribute("disabled", true);
  }
}

function enableTry() {
  if (loadStatus) {
    for (let i = 0; i < window.tryButtons.length; i++) {
      document
        .getElementsByTagName("button")
        [window.tryButtons[i]].removeAttribute("disabled", true);
    }
  }
}

function OnDesignLoad(state) {
  let clickEvent = new CustomEvent("onDesignProgress", { detail: state });
  window.dispatchEvent(clickEvent);
}

function showWebGLProgress(messageData) {
  // messageData = JSON.parse(messageData)
  window.webgl.showWebGLProgress(messageData);
}

function showWebGLMessage(messageData) {
  // messageData = JSON.parse(messageData)
  window.webgl.showWebGLMessage(messageData);
}

function hideProgress(messageData) {
  // messageData = JSON.parse(messageData)
  window.webgl.hideProgress();
}

function DownloadedProducts(processData) {
  let total = processData.total_products + processData.total_finishes;
  let total_remaining =
    processData.remaining_products + processData.remaining_finishes;
  // messageData = {message: " Hang on! Let me fetch the products from the cloud. "+ total_remaining +" to go. ", type: "info",duration: 4, state: 0};
  window.webgl.showDesignLoadMessage(total_remaining);
  // if(total_remaining !== 0){
  //   window.webgl.showWebGLProgress( messageData)
  // }else{
  //   window.webgl.hideProgress()
  // }
}

function OnDesignRotate(state) {
  let clickEvent = new CustomEvent("OnDesignRotate", { detail: state });
  window.dispatchEvent(clickEvent);
}

function OnWallContext(data) {
  let catalogDetails = {
    catalog_wallpaper: "5225",
    catalog_paint: "1285",
    catalog_floor: "5227",
    catalog_finishes: "5225",
    catalog_tiles: "5653",
    catalog_carpets: "5654",
  };

  if (window.curentUserPreferences !== undefined) {
    catalogDetails = window.curentUserPreferences;
  }

  if (data.type === "wallpaper") {
    window.GAEvent("ContextualMenu", "Catalog", "Wall", "wallpaper");
    window.headerComponent.onCatalogLoad(
      catalogDetails["catalog_wallpaper"],
      null,
      "finishes"
    );
  } else if (data.type === "finish") {
    window.GAEvent("ContextualMenu", "Catalog", "Wall", "finish");
    window.headerComponent.onCatalogLoad(
      catalogDetails["catalog_finishes"],
      null,
      "finishes"
    );
  } else {
    window.GAEvent("ContextualMenu", "Catalog", "Wall", "paints");
    window.headerComponent.onCatalogLoad(
      catalogDetails["catalog_paint"],
      null,
      "paints"
    );
  }
}

function OnFloorContext(data) {
  let catalogDetails = {
    catalog_wallpaper: "5225",
    catalog_paint: "1285",
    catalog_floor: "5227",
    catalog_finishes: "5225",
    catalog_tiles: "5653",
    catalog_carpets: "5654",
  };

  if (window.curentUserPreferences !== undefined) {
    catalogDetails = window.curentUserPreferences;
  }

  if (data.type === "floor") {
    window.GAEvent("ContextualMenu", "Catalog", "Floor", "floor");
    window.headerComponent.onCatalogLoad(
      catalogDetails["catalog_floor"],
      null,
      "finishes"
    );
  } else if (data.type === "tiles") {
    window.GAEvent("ContextualMenu", "Catalog", "Floor", "tile");
    window.headerComponent.onCatalogLoad(
      catalogDetails["catalog_tiles"],
      null,
      "finishes"
    );
  } else if (data.type === "carpets") {
    window.GAEvent("ContextualMenu", "Catalog", "Floor", "carpet");
    window.headerComponent.onCatalogLoad(
      catalogDetails["catalog_carpets"],
      null,
      "finishes"
    );
  }
}

function OnCeilingContext(data) {
  let catalogDetails = {
    catalog_wallpaper: "5225",
    catalog_paint: "1285",
    catalog_floor: "5227",
    catalog_finishes: "5225",
    catalog_tiles: "5653",
    catalog_carpets: "5654",
  };

  // if (window.curentUserPreferences !== undefined) {
  //     catalogDetails = window.curentUserPreferences
  // }

  if (data.type === "false_ceiling") {
    window.GAEvent("ContextualMenu", "Catalog", "Ceiling", "False Ceiling");
    window.headerComponent.onCatalogLoad("3307", null, "products");
  } else if (data.type === "finishes") {
    window.GAEvent("ContextualMenu", "Catalog", "Floor", "Finishes");
    window.headerComponent.onCatalogLoad("12083", null, "finishes");
  }
}

function AutoSaveProject() {
  //  this.localUnityContent.send("RomeManager", "SaveItemDesign");
  if (window.curentUserPreferences !== undefined) {
    this.localUnityContent.send(
      "RomeManager",
      "SaveItemDesign",
      JSON.stringify({
        proj_id: parseInt(window.curentUserPreferences.playground_project),
        design_id: parseInt(window.curentUserPreferences.playground_design),
      })
    );
  }
}

function DesignSaved() {}

function OnObjectSelect(data) {
  window.webgl.OnCtObjectSelect(data);
}

function OnObjectDeselect(data) {
  window.webgl.OnCtObjectDeSelect();
}

function ContextDataToJSON(data) {
  // Removing extra values to handle the finish delete use case
  // Canvas is not handing the deleted finish use case.
  var jsonData = {};
  if (data) {
    jsonData["value"] = data["value"];
    jsonData["type"] = data["type"];
  }
  return JSON.stringify(jsonData);
}

function OnObjectInfo(data) {
  // console.log("OnObjectInfoData", data);
  // if( data.type == "product"){
  this.localUnityContent.send(
    "RomeManager",
    "OnObjectInfo",
    ContextDataToJSON(data)
  );
  // }else{
  // window.webgl.OnCtObjectInfoData(data)
  // }
}

function OnObjectCart(data) {
  // console.log("OnObjectCartData", data);
  this.localUnityContent.send(
    "RomeManager",
    "OnObjectCart",
    ContextDataToJSON(data)
  );
}

function OnObjectDelete(data) {
  // console.log("OnObjectDelete", data);
  this.localUnityContent.send(
    "RomeManager",
    "OnObjectDelete",
    ContextDataToJSON(data)
  );
}

function OnHomeAutomation(state, room_data = []) {
  if (loadStatus) {
    var json_data = JSON.stringify({
      state: state,
      room_automation_details: room_data,
    });
    this.localUnityContent.send(
      "RomeManager",
      "HomeAutomationState",
      json_data
    );
  }
}

// function OnRoomAutomation(active_uuids, inactive_uuids) {
//     console.log("RoomAutomation Start");
//     console.log(active_uuids)
//     var json_data = JSON.stringify({ active_uuids: active_uuids, inactive_uuids: inactive_uuids });
//     this.localUnityContent.send("RomeManager", "RoomAutomationState", json_data)
// }
function SwapWallStructure(product_id, category) {
  var json_data = JSON.stringify({
    product_id: product_id,
    category: category,
  });
  this.localUnityContent.send("RomeManager", "SwapWallStructure", json_data);
}

function swapAllWallStructures(product_id, category) {
  var json_data = JSON.stringify({
    product_id: product_id,
    category: category,
  });
  this.localUnityContent.send("RomeManager", "SwapAllWallStructures", json_data);
}

function OnObjectInfoData(data) {
  // window.contextualMenuComponent.OnShowInfoData(data)
  window.webgl.OnCtObjectInfoData(JSON.parse(data.value));
  // console.log("OnObjectInfoData", data);
}

function OnObjectCartData(data) {
  // console.log("OnObjectCartData", data);
  window.webgl.OnContextMenuAddProduct(data);
}

function OnProductContext(data) {
  if (data.type === "product") {
    if (data.category_path) {
      window.GAEvent(
        "ContextualMenu",
        "Catalog",
        "Product",
        data.category_path.split(".")[0]
      );
      window.headerComponent.onCatalogLoad(
        data.category_path.split(".")[0],
        null,
        "products"
      );
    } else {
      window.GAEvent("ContextualMenu", "Catalog", "Product", data.value);
      window.headerComponent.onCatalogLoad(data.value, "Product", "products");
    }
  }
}

function getCdnUrl() {
  // return window.assetCdnUrls[Math.floor(Math.random() * assetCdnUrls.length)];
  if (window.env_asset_url) {
    var cdn_link = window.env_asset_url;
    var cndIndex = window.currentCDNIndex;
    cdn_link = cdn_link.replace(/1/, cndIndex);

    if (window.currentCDNIndex < 4) {
      window.currentCDNIndex = window.currentCDNIndex + 1;
    } else {
      window.currentCDNIndex = 1;
    }
    return cdn_link;
  }

  return window.env_asset_url;
}

function getRomeCdnUrl() {
  // return window.assetCdnUrls[Math.floor(Math.random() * assetCdnUrls.length)];
  if (window.env_rome_asset_url) {
    var rome_cdn_link = window.env_rome_asset_url;
    var cndIndex = window.currentRomeCDNIndex;
    rome_cdn_link = rome_cdn_link.replace(/1/, cndIndex);

    if (window.currentRomeCDNIndex < 4) {
      window.currentRomeCDNIndex = window.currentRomeCDNIndex + 1;
    } else {
      window.currentRomeCDNIndex = 1;
    }
    return rome_cdn_link;
  }

  return window.env_rome_asset_url;
}

function onDesignRotateClick(state) {
  this.localUnityContent.send("RomeManager", "RotateDesign", parseInt(state));
}
function animateSelectedProduct(state) {
  this.localUnityContent.send("RomeManager", "AnimateSelectedProduct", "");
}
function savePersonalisationData() {
  if (loadStatus) {
    this.localUnityContent.send("RomeManager", "SavePersonalisationData", "");
  }
}
function applyFinishToAllInKitchen(state) {
  this.localUnityContent.send(
    "RomeManager",
    "ApplyFinishToAllInKitchen",
    state
  );
}

function applyFinishToAllProductParts(state) {
  this.localUnityContent.send(
    "RomeManager",
    "ApplyFinishToAllProductParts",
    state
  );
}

function OnHybridRoomThemeClick(id, source_id, target_id, source_type) {
  const tempJson = {
    id: id,
    couples: [
      {
        source_id: parseInt(source_id),
        target_id: target_id,
        source_type: source_type,
      },
    ],
  };
  // console.log(JSON.stringify(tempJson));
  this.localUnityContent.send(
    "RomeManager",
    "OnHybridRoomThemeClick",
    JSON.stringify(tempJson)
  );
}

function OnSetWebLightState(data) {
  window.playBar.brightness(data.state, false);
}

function UpdateUniqueKey(data) {
  window.uniqe_key = data.uuid;
}

function CBFloorplanSelectRoom(data) {
  window.floorplanVerification.SelectRoomByKey(data.uuid);
}

function OnItem(state) {
  // console.log("OnItem : "+ state);
  let clickEvent = null;
  if (state) {
    // Show selected product
    // clickEvent = new CustomEvent('productDeselected' );
    // window.dispatchEvent(clickEvent)
  } else {
    // clickEvent = new CustomEvent('productDeselected' );
    // window.dispatchEvent(clickEvent)
  }
}
// For apply of product in finish
function OnProductSelect(state) {
  let clickEvent = null;
  if (state) {
    // Show selected product
    // clickEvent = new CustomEvent('productDeselected' );
    // window.dispatchEvent(clickEvent)
  } else {
    clickEvent = new CustomEvent("productDeselected");
    window.dispatchEvent(clickEvent);
  }
}

function LoadVariantFinish(finishId, productId) {
  this.localUnityContent.send(
    "RomeManager",
    "OnVariantFinish",
    JSON.stringify({
      finish_id: parseInt(finishId),
      product_id: parseInt(productId),
    })
  );
  // this.localUnityContent.send("RomeManager", "OnVariantProduct", parseInt(productId));
}

function SetProjectDetails(data) {}

function lazyLoad() {
  var lazyImages = [].slice.call(document.querySelectorAll(".catalog"));
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to a more compatible method here
  }
}

function raisedEvents(params) {
  if (params.event_name === "OnProductClick") {
    if (params.event_status === "onProgress") {
      let valueTypes = params.data;
      // SD NEEDS TO BE HANDLED FURTHER
      // let valueTypes = params.data.length > 0 ? params.data.split(",") : params.data
      if (valueTypes === "3") {
        // Ceiling Case
        // window.webgl.updateMessageState("Now CLICK ONCE anywhere on the Ceiling to Place the Product")
        window.webgl.updateMessageState("Click in the home to apply");
      }
      if (valueTypes === "1") {
        // Floor Case
        // window.webgl.updateMessageState("Now CLICK ONCE anywhere on the Floor to Place the Product")
        window.webgl.updateMessageState("Click in the home to apply");
      }
      if (valueTypes === "2") {
        // Wall Case
        // window.webgl.updateMessageState("Now CLICK ONCE anywhere on the Wall to Place the Product")
        window.webgl.updateMessageState("Click in the home to apply");
      }
      if (valueTypes === "1,2") {
        // Wall and Floor
        // window.webgl.updateMessageState("Now CLICK ONCE anywhere on the Wall to Place the Product")
        window.webgl.updateMessageState("Click in the home to apply");
      }
    }
  }
  if (params.event_name === "OnFinishClick") {
    if (params.event_status === "onProgress") {
      window.webgl.updateMessageState("Click in the home to apply");
    }
  }
}

function ActiveProjectDetails(params) {
  window.webgl.updateActiveProjectDetails(params);
}

function HighlightRoomBorder(room_uuid, value) {
  this.localUnityContent.send(
    "RomeManager",
    "HighlightRoomBorder",
    JSON.stringify({ room_id: room_uuid, highlight: value })
  );
  // this.localUnityContent.send("RomeManager", "OnVariantProduct", parseInt(productId));
}

function Wallpanel(product_id, templateType, isProductActive) {
  this.localUnityContent.send(
    "RomeManager",
    "OnWallPanelApply",
    JSON.stringify({
      ProductID: product_id,
      IsProductActiveInScene: isProductActive,
      TemplateType: templateType,
    })
  );
}
function FalseCeiling(product_id, templateType, isProductActive) {
  this.localUnityContent.send(
    "RomeManager",
    "OnFalseCielingApply",
    JSON.stringify({
      ProductID: product_id,
      IsProductActiveInScene: isProductActive,
      TemplateType: templateType,
    })
  );
}

function OnFloorDesignApply(uuid) {
  this.localUnityContent.send(
    "RomeManager",
    "OnFloorDesignApply",
    JSON.stringify({
      uuid: uuid,
    })
  );
}

function toggleBannerMessage(obj) {
  window.playBar.handleBannerMessageState(obj.state, obj.message, obj.type);
}

function showNotification(data) {
  // console.log(data);
  window.playBar.handleIncomingToast(data);
}

function scrollToTop() {
  let element = document.getElementsByClassName("app-content")[0];
  if (element) {
    element.scrollTo({
      top: 0,
    });
  }
}

// Canvas Status Functions
function floorplanLoadStatus(param) {
  if (param === 1) {
    window.canvasWrapper.onFloorplanLoadCallback();
  } else if (param === 0) {
    setTimeout(() => {
      window.canvasWrapper.onFloorplanLoadCallback();
      floorplanProductsLoad();
    }, 2000);
  }
}
function floorplanProductsLoad() {
  window.canvasWrapper.onFlooplanProductLoadCallback();
}
function productLoadStatus(param) {
  if (param === 1) {
    window.canvasWrapper.onProductLoadStatus(true);
  } else if (param === 0) {
    window.canvasWrapper.onProductLoadStatus(false);
  }
}

function roomChangeStatus(param) {
  if (param.roomuuid !== "all_rooms") {
    window.canvasWrapper.onRoomSwitchCallback();
  }
}

function getProductsInCanvas(data) {
  this.localUnityContent.send(
    "RomeManager",
    "GetProductsInTheRoomDetails",
    JSON.stringify(data)
  );
}

function variantThemeApply(data) {
  this.localUnityContent.send(
    "RomeManager",
    "OnVariantThemeClick",
    JSON.stringify(data)
  );
}

function productToRoomDetails(data) {
  // let evt = new CustomEvent('productInRoomData', { detail: data });
  // window.dispatchEvent(evt);
}

function rotateFinish(val) {
  this.localUnityContent.send("RomeManager", "RotateFinish", val);
}
function resetCamera(val) {
  this.localUnityContent.send("RomeManager", "ResetCamera", "");
}

function customProductDelete(productId = [], finishId = []) {
  if (loadStatus) {
    const obj = {
      product_id: productId,
      finish_id: finishId,
    };
    // console.log(obj);
    alert("delete clicked");
    this.localUnityContent.send(
      "RomeManager",
      "CustomDeleteItem",
      JSON.stringify(obj)
    );
  }
}

var seoData = [];

var demoDataProd = [
  {
    roomName: "Living Room",
    roomUUID: "c4a63557-b2e9-436a-9ec8-a018593d360b",
    roomType: "2",
  },
  {
    roomName: "Kid's Bedroom",
    roomUUID: "ba4ee023-fdb3-4b7d-8c48-129a339271ec",
    roomType: "7",
  },
  {
    roomName: "Guest Bedroom",
    roomUUID: "c82bf509-6476-4e98-93fa-e670dabc551c",
    roomType: "6",
  },
  {
    roomName: "Dining",
    roomUUID: "9c0e845e-c322-4682-8019-0dbed93ff715",
    roomType: "4",
  },
  {
    roomName: "Kitchen",
    roomUUID: "430d4f5c-be74-4e5a-b241-f715365b47a6",
    roomType: "1",
  },
  {
    roomName: "Master Bedroom",
    roomUUID: "220b9988-a308-4027-b20b-b4625a02fee1",
    roomType: "3",
  },
  {
    roomName: "Balcony",
    roomUUID: "e6c4cb8c-51c4-44f5-9ec9-6fb6315c55f1",
    roomType: "5",
  },
];

var demoDataStag = [
  {
    roomName: "Living Room",
    roomUUID: "0c587810-3111-4a96-8089-3116094d9e6d",
    roomType: "2",
  },
  {
    roomName: "Kid's Bedroom",
    roomUUID: "82b7bf4a-2475-45cb-a057-0a653bc7d3e3",
    roomType: "7",
  },
  {
    roomName: "Guest Bedroom",
    roomUUID: "0cb108cf-1caf-4adf-8ba4-510fb4d7a54b",
    roomType: "6",
  },
  {
    roomName: "Dining",
    roomUUID: "d06c7651-fa48-455d-bf0e-3715a34e0b8b",
    roomType: "4",
  },
  {
    roomName: "Kitchen",
    roomUUID: "2e10442c-fc52-4148-bd06-628f3ccf6773",
    roomType: "1",
  },
  {
    roomName: "Master Bedroom",
    roomUUID: "f2fc96dc-ca2d-4e77-9b85-624a590cb6ac",
    roomType: "3",
  },
  {
    roomName: "Balcony",
    roomUUID: "a1867d86-dcaa-4a26-b1a5-28b9a50d5ecb",
    roomType: "5",
  },
];

function productApplyV2(
  productId,
  variantId,
  merchantableId,
  finishableId,
  addons
) {
  window.tryProductClicked = false;
  window.GAEvent("Catalog", "ProductClick", "", productId,{project_id: window.project_id, design_id: window.design_id, floorplan_id: window.floorplan_id, room_id: window.selectedRoom});
  const obj = {
    product_id: productId ?? 0,
    variant_id: variantId ?? 0,
    merchantable_id: merchantableId ?? 0,
    finishable_id: finishableId ?? 0,
    addons: addons ?? [],
  };
  this.localUnityContent.send(
    "RomeManager",
    "OnProductVariantApply",
    JSON.stringify(obj)
  );
}
function finishApplyV2(
  finishId,
  variantId,
  merchantableId,
  finishableId,
  addons
) {
  window.tryProductClicked = false;
  window.GAEvent("Catalog", "FinishClick", "", finishId,{project_id: window.project_id, design_id: window.design_id, floorplan_id: window.floorplan_id, room_id: window.selectedRoom});
  const obj = {
    finish_id: finishId ?? 0,
    variant_id: variantId ?? 0,
    merchantable_id: merchantableId ?? 0,
    finishable_id: finishableId ?? 0,
    addons: addons ?? [],
  };
  this.localUnityContent.send(
    "RomeManager",
    "OnFinishApply",
    JSON.stringify(obj)
  );
}

function paintApplyV2(finishId, hex, variantId, merchantableId) {
  if (loadStatus) {
    window.tryProductClicked = false;
    window.GAEvent("Catalog", "PaintClick", finishId, hex,{project_id: window.project_id, design_id: window.design_id, floorplan_id: window.floorplan_id, room_id: window.selectedRoom});
    this.localUnityContent.send(
      "RomeManager",
      "OnPaintClick",
      JSON.stringify({
        finish_id: finishId,
        hex: hex,
        variant_id: variantId ?? 0,
        merchantable_id: merchantableId ?? 0,
      })
    );
  }
}

function replaceProductInScene({
  id,
  variantId,
  merchantableId,
  finishableId,
  type = "product",
  addons,
}) {
  window.GAEvent("Customize", "ReplaceProductInCanvasClick", type, id);

  const obj = {
    source_id: id,
    variant_id: variantId ?? 0,
    merchantable_id: merchantableId ?? 0,
    finishable_id: finishableId ?? 0,
    product_type: type ?? "product",
    addons: addons ?? [],
    hex:""
  };
  this.localUnityContent.send(
    "RomeManager",
    "ReplaceProduct",
    JSON.stringify(obj)
  );
}

function variantFinishApply(
  finishId = 0,
  hex = "",
  merchantableId = 0,
  parentUniqueId = 0,
  parentVariantId = 0,
  parentFinishableId = 0
) {
  window.GAEvent("Customize", "ProductFinishClick", "", finishId,{project_id: window.project_id, design_id: window.design_id, floorplan_id: window.floorplan_id, room_id: window.selectedRoom});
  const obj = {
    finish_id: finishId,
    hex: hex,
    merchantable_id: merchantableId ?? 0,
    parent_unique_id: parentUniqueId ?? 0,
    parent_variant_id: parentVariantId ?? 0,
    parent_finishable_id: parentFinishableId ?? 0,
  };

  this.localUnityContent.send(
    "RomeManager",
    "OnUpdatedProductFinshApply",
    JSON.stringify(obj)
  );
}

function triggerFinishVariantsDrawer(data) {
  // window.webgl.showFinishVariantDrawer(data);
}

function initializeSocketConnection(data) {
  let evt = new CustomEvent("webSocketConnectionRequest", {
    detail: { socketId: data.ssid },
  });
  window.dispatchEvent(evt);
}

function updateAutoSaveProgress(param) {
  let evt = new CustomEvent("updateAutoSaveProgress", {
    detail: { status: param === 1 },
  });
  window.dispatchEvent(evt);
}

function ApiResponseCode(param) {
  let evt = new CustomEvent("loginPromptRequest", { detail: {} });
  window.dispatchEvent(evt);
}

function OnCustomiseClick(data) {
  window.webgl.showProductVariantDrawer(data);
}

function OnProductFinishClick(data) {
  window.webgl.showFinishVariantDrawer(data);
}

function OnAddToCartClick(data) {
  if (!window.isMerchant) {
    window.webgl.addToCart(data);
  }
}

function SetWebGlPlatformAsMac() {
  this.localUnityContent.send("RomeManager", "SetWebGlPlatformAsMac");
}
function AutoFinishApply(data) {
  this.localUnityContent.send(
    "RomeManager",
    "AutoFinishApply",
    JSON.stringify(data)
  );
}

function OnFinishApplyForAutoPaint(data) {
  let evt = new CustomEvent("onAutoPaint", {
    detail: data,
  });
  if (window.merchantName!="rustomjee"){
    window.dispatchEvent(evt);
  } else{
    window.AutoFinishApply(data);
  }
  
}

function OnRoomPointClick(data) {
  let type = "p";

  if (data.type_id === 1) {
    type = "p";
  } else if (data.type_id === 2) {
    type = "f";
  } else if (data.type_id === 3) {
    type = "t";
  }

  const params = new URLSearchParams({ source: "canvas" });
  data.categories.forEach((category) => {
    params.append("categories", category);
  });
  const queryParams = params.toString();
  let evt = new CustomEvent("onHistoryPush", {
    detail: {
      path: `/catalogs/${type}/${data.catalogId}?${queryParams}`,
      replace: false,
    },
  });
  window.dispatchEvent(evt);
}

function ToggleRoomPoints() {
  this.localUnityContent.send("RomeManager", "ToggleRoomPoints", "");
}

function ReplaceStructureClick() {
  if (typeof window.webgl?.showStructuresModal === "function") {
    window.webgl.showStructuresModal();
  }
}

function LockAllSimilarFloorplanFinishes(data) {
  if (typeof window.webgl?.showFinishesMenu === "function") {
    window.webgl.showFinishesMenu({ ...data, actionType: "lock_all" });
  }
}
function OnLockAllSimilarFloorplanFinishes(data) {
  this.localUnityContent.send(
    "RomeManager",
    "OnLockAllSimilarFloorplanFinishes",
    JSON.stringify(data)
  );
}
function UnlockAllSimilarFloorplanFinishes(data) {
  if (typeof window.webgl?.showFinishesMenu === "function") {
    window.webgl.showFinishesMenu({ ...data, actionType: "unlock_all" });
  }
}
function OnUnlockAllSimilarFloorplanFinishes(data) {
  this.localUnityContent.send(
    "RomeManager",
    "OnUnlockAllSimilarFloorplanFinishes",
    JSON.stringify(data)
  );
}
function DeleteAllSimilarFinishes(data) {
  if (typeof window.webgl?.showFinishesMenu === "function") {
    window.webgl.showFinishesMenu({ ...data, actionType: "delete_all" });
  }
}
function OnDeleteAllSimilarFinishes(data) {
  this.localUnityContent.send(
    "RomeManager",
    "OnDeleteAllSimilarFinishes",
    JSON.stringify(data)
  );
}

function OnFinishApplyForAllKitchenProducts(data) {
  if (typeof window.webgl?.showFinishesMenu === "function") {
    window.webgl.showFinishesMenu({ ...data, actionType: "kitchen_apply" });
  }
}

function OnFinishApplyForAllProductParts(data) {
  if (typeof window.webgl?.showFinishesMenu === "function") {
    window.webgl.showFinishesMenu({ ...data, actionType: "products_apply" });
  }
}

function switchCanvasMode(state) {
  this.localUnityContent.send(
    "RomeManager",
    "SwitchCanvasMode",
    parseInt(state)
  ); // 0 - Design, 1 - Edit
}

function autoZoomIn(){
  this.localUnityContent.send(
    "RomeManager",
    "AutoZoomIn",
  )
}

function autoPaintWall(){
  this.localUnityContent.send(
    "RomeManager",
    "AutoPaintWall",
  )
}

function autoZoomInDisable(){
  this.localUnityContent.send(
    "RomeManager",
    "AutoZoomInDisable",
  )
}

function disableJoyStick(){
  this.localUnityContent.send(
    "RomeManager",
    "DisableJoystick",
  )
}

function enableJoystick(){
  this.localUnityContent.send(
    "RomeManager",
    "EnableJoystick",
  )
}

function autoMove(){
  this.localUnityContent.send(
    "RomeManager",
    "AutoMove",
  )
}

function autoMoveDisable(){
  this.localUnityContent.send(
    "RomeManager",
    "AutoMoveDisable",
  )
}

function playParticles(){
  this.localUnityContent.send(
    "RomeManager",
    "PlayParticles",
  )
}

function clearRoom(){
  this.localUnityContent.send(
    "RomeManager",
    "ClearRoom",
  )
}

function onKeyClick(){
  this.localUnityContent.send(
    "RomeManager",
    "OnKeyClick"
  )
}

function onKeyClickDisable(){
  this.localUnityContent.send(
    "RomeManager",
    "OnKeyClickDisable",
  )
}

function DeleteSuccessful(){}

function lightProductAvailableInDesign(){
  this.localUnityContent.send(
    "RomeManager",
    "LightProductAvailableInDesign",
  )
}

function LightProductAvailableInDesign(data){
  window.lightProductAvailable = data
}

function sendNumberOfProductsInRoomToWeb(data){
  this.localUnityContent.send(
    "RomeManager",
    "SendNumberOfProductsInRoomToWeb",
    data
  )
}

function SendNumberOfProductsInRoomToWeb(data){
  window.numberOfProfuctsInRoom = data;
}

function isLightProductAvailableInTheRoom(data){
  this.localUnityContent.send(
    "RomeManager",
    "IsLightProductAvailableInTheRoom",
    data
  )
}

function IsLightProductAvailableInTheRoom(data){
  window.lightProductAvailable = data
}

function SendMessageToWeb(data){


  // console.log(data);
}

function systemCheckStepComplete(data){
  const actionMap = {
    "AutoZoomInComplete": [
      window.playParticles,
      () => window.headerComponent.toggleSystemCheckSteps(1, 2)
    ],
    "AutoMoveComplete": [
      window.playParticles,
      () => window.headerComponent.toggleSystemCheckSteps(1, 4)
    ],
    "FinishApply": [
      window.playParticles
    ]
  };

  const { action } = data;

  if (action in actionMap) {
    const actionFunctions = actionMap[action];
    actionFunctions.forEach(func => func());
  }

  if(action === "RotateCompleted" && window.isRotateStep){
    window.playParticles();
    window.headerComponent.toggleSystemCheckSteps(1, 3)
  }

  if(action === "DeleteProductClick" && window.isDeleteStep){
    window.headerComponent.toggleSystemCheckPopup()
  }
  
  if(action === "AutoZoomInProgress"){
    window.headerComponent.updateProgressData("zoom", parseInt(data.value))
  }

  if(action === "RotateInProgress"){
    window.headerComponent.updateProgressData("rotate", parseInt(data.value))
  }

}

function ftueFeatureUpdate(data){
  const featureMap = {
    "ProductAppliedSuccessfully":"product",
    "FinishAppliedSuccessfully":"finish",
    "ProductFinishAppliedSuccessfully": "finish",
    "ThemeLoadedSuccessfuly":"design",
    "ScreenshotSuccess":"snapshot",
    "WalkthroughRequest":"walk_through",
    "HDRenderSuccess": "hd_render",
  }

  const {label} = data

  if(label in featureMap){
    const type = featureMap[label];
    window.headerComponent.updateFtueFeature(type);
  }
}

function deleteWallStructure(){
  if(loadStatus){
    this.localUnityContent.send(
      "RomeManager",
      "DeleteWallStructure",
    )
  }
} 
function includeWallInSelectedRooms(data){
  
  if(loadStatus){
    this.localUnityContent.send(
      "RomeManager",
      "IncludeWallInSelectedRooms",
      JSON.stringify(data)
    )
  }
}

function floorPlanSaveForEditMode(){
  if(loadStatus){
    this.localUnityContent.send(
      "RomeManager",
      "FloorplanSaveForEditMode",
    )
  }
}
function isWallAdded(){
  // console.log("hello")
  window.headerComponent.updateWallAdded();
}

function isWallSelected(){
  window.headerComponent.updateWallSelectStatus(true);
}

function generateDotUI(){
  if(loadStatus){
    this.localUnityContent.send(
      "RomeManager",
      "GenerateDotUI",
    )
  }
}

function clearGeneratedDotUI(){
  this.localUnityContent.send(
    "RomeManager",
    "ClearGeneratedDotUI",
  )
}

function hideUnHideFinishes(){
  this.localUnityContent.send(
    "RomeManager",
    "HideUnHideFinishes"
  )
}

function hideUnHideProducts(data){
  this.localUnityContent.send(
    "RomeManager",
    "HideUnHideProducts",
    JSON.stringify(data)
  )
}

function switchSkyBox(data){
  this.localUnityContent.send(
    "RomeManager",
    "SwitchSkyBox",
    data
  )
}

function wallMovement(data){
   window.headerComponent.wallMovementStatus(data);
}
  function CanvasAnalytics(data) {
   
    data = data[0];
    if(window.isNewSystemCheck){
      window.systemCheckStepComplete(data); 
      if (data.action in ["AutoZoomInProgress", "RotateInProgress"]){
        return
      }
    }
    if(data.label==="WallStructureAdded"){
      window.isWallAdded()
    }
    if(data.category==="WallMovement"){
      window.wallMovement(data.action)
    }
    if(window.ftueFlag && window.isSystemCheck!== true){
      window.ftueFeatureUpdate(data);
    }
  
    if (data) {
      window.GAEvent(
        data["category"],
        data["action"],
        data["label"],
        data["value"],
        JSON.stringify(data["extraParams"])
      );
    }
  }