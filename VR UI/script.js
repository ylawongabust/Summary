import * as THREE from 'three';
import { Group, TextureLoader, Vector3} from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ThreeMeshUI from 'three-mesh-ui';

let scene, camera, renderer, controls, objsToTest = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = mouse.y = null;
const position = new THREE.Vector3();
let emojiContainerID;

// listing out all subcategories
const nameArray = [
	["People & Body_0.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_6.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_12.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_18.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_24.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_30.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_36.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_42.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_48.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_54.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_60.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_66.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_72.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_78.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_84.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_90.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_96.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_102.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_108.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_114.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_120.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_126.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_132.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_138.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_144.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_150.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_156.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_162.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_168.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_174.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_180.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_186.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_192.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_198.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_204.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_210.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_216.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_222.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_228.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_254.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_260.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_266.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_272.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_278.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_286.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_292.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_298.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_304.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_310.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_326.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_332.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_338.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_344.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_350.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_356.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_362.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_368.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_374.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_380.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_386.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_392.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_398.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_404.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_410.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_416.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_422.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_428.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_434.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_440.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_446.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_452.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_458.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_464.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_470.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_476.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_482.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_488.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_494.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_500.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_506.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_512.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_518.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_524.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_530.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_536.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_542.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_548.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_554.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_560.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_566.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_572.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_578.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_584.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_590.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_596.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_602.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_608.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_614.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_620.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_626.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_632.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_638.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_644.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_650.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_656.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_662.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_668.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_674.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_680.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_686.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_692.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_698.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_704.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_710.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_716.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_722.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_728.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_734.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_740.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_746.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_752.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_758.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_764.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_770.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_776.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_782.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_788.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_794.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_800.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_806.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_812.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_818.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_824.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_830.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_836.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_842.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_848.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_854.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_860.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_866.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_872.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_878.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_884.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_890.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_896.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_902.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_908.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_914.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_920.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_926.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_932.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_938.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_944.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_950.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_956.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_962.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_968.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_974.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_980.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_986.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_992.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_998.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1004.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1010.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1016.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1022.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1028.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1034.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1040.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1046.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1052.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1058.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1064.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1070.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1076.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1082.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1088.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1094.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1100.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1106.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1112.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1118.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1124.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1130.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1136.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1142.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1148.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1154.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1160.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1166.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1172.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1178.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1184.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1190.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1196.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1202.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1208.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1214.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1220.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1226.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1232.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1238.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1244.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1250.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1256.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1262.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1268.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1274.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1280.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1286.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1292.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1298.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1304.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1310.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1323.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1329.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1335.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1341.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1347.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1353.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1359.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1365.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1371.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1377.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1383.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1389.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1395.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1401.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1407.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1413.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1419.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1425.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1431.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1437.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1443.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1449.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1455.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1461.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1467.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1473.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1479.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1485.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1491.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1497.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1500.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1506.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1512.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1518.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1524.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1530.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1536.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1543.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1551.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1557.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1563.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1569.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1575.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1581.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1587.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1593.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1599.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1605.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1611.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1617.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1623.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1629.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1635.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1641.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1647.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1653.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1659.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1665.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1671.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1677.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1683.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1689.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1695.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1701.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1707.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1716.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1722.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1728.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1734.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1740.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1746.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1752.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1758.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1764.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1770.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1776.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1782.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1788.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1794.svg", { category: "People & Body", numOfEmojis: 6 }],
	["People & Body_1800.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_1826.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_1852.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_1878.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_1904.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_1930.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_1956.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_1982.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_2008.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_2034.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_2060.svg", { category: "People & Body", numOfEmojis: 26 }],
	["People & Body_2086.svg", { category: "People & Body", numOfEmojis: 26 }],
]
const nameMap = new Map(nameArray);


// attributes for buttons
const hoveredStateAttributes = {
	offset: 0.02,
	state: 'hovered',
	attributes: {
		borderOpacity: 1,
	},
};

const idleStateAttributes = {
	state: 'idle',
	attributes: {
		borderOpacity: 0,
	},
};

const selectedAttributes = {
	// offset: 0.02,
};


// window event handler
let selectState = false;
window.addEventListener('pointermove', (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('pointerdown', () => {
	selectState = true;
});

window.addEventListener('pointerup', () => {
	selectState = false;
});

window.addEventListener('touchstart', (event) => {
	selectState = true;
	mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('touchend', () => {
	selectState = false;
	mouse.x = null;
	mouse.y = null;
});

window.addEventListener('load', () => {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x9ea4ad);
	const axesHelper = new THREE.AxesHelper(2);
	scene.add(axesHelper);

	const WIDTH = window.innerWidth;
	const HEIGHT = window.innerHeight;
	camera = new THREE.PerspectiveCamera(750, WIDTH / HEIGHT, 0.1, 1000);
	camera.position.z = 5;
	camera.position.y = 4.5;

	renderer = new THREE.WebGLRenderer();
	renderer.localClippingEnabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.xr.enabled = true;
	document.body.appendChild(renderer.domElement);

	controls = new OrbitControls(camera, renderer.domElement);

	makeTextPanel();

	animate();
})

function makeTextPanel() {
	let chatBoxObject = new Group();

	let currentChatNameContainer = new ThreeMeshUI.Block({
		height: 0.15,
		width: 0.5,
		borderRadius: [0.05, 0.05, 0.05, 0.05],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		hiddenOverflow: true,
		bestFit: 'auto',
		justifyContent: 'center',
	});
	currentChatNameContainer.position.set(0, 0.95, 0);
	currentChatNameContainer.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.png'
	});
	let currentChatNameText = new ThreeMeshUI.Text({
		content: "Global",
	});
	currentChatNameContainer.add(currentChatNameText);
	chatBoxObject.add(currentChatNameContainer);

	let mainContainer = new ThreeMeshUI.Block({
		height: 1.7,
		width: 2.15,
		padding: 0.1,
		borderRadius: [0.05, 0.05, 0.05, 0.05],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		alignContent: 'center',
		justifyContent: 'end',
		hiddenOverflow: true,
	});
	mainContainer.position.copy(new Vector3(0, 0, 0));
	mainContainer.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.png'
	});
	chatBoxObject.add(mainContainer);

	let chatScrollContainer = new ThreeMeshUI.Block({
		height: 1.5,
		width: 1.95,
		borderRadius: [0, 0, 0, 0],
		justifyContent: 'end',
		backgroundOpacity: 0,
		interLine: 0.1,
	});
	mainContainer.add(chatScrollContainer);

	const chatContainer = new ThreeMeshUI.Block({
		height: 0.5,
		width: 2.15,
		borderRadius: [0.05, 0.05, 0.05, 0.05],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		hiddenOverflow: true,
		contentDirection: "row",
		alignItems: 'start',
	});
	chatContainer.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.png'
	});

	const userListBtnContainer = new ThreeMeshUI.Block({
		padding: 0.02,
		width: 0.17,
		height: 0.4,
		backgroundOpacity: 0,
		hiddenOverflow: true,
		interLine: 0.05,
	});

	const textureLoader = new TextureLoader();
	const userListButton = new ThreeMeshUI.InlineBlock({
		height: 0.1,
		width: 0.1,
		borderRadius: [0, 0, 0, 0],
	});
	textureLoader.load('chatbox/private-chat.svg', (texture) => {
		userListButton.set({ backgroundTexture: texture });
	});
	userListBtnContainer.add(userListButton);
	chatContainer.add(userListBtnContainer);

	const chatMainContainer = new ThreeMeshUI.Block({
		width: 1.8,
		height: 0.4,
		padding: 0.05,
		borderRadius: [0.05, 0.05, 0.05, 0.05],
		backgroundColor: new THREE.Color('#424242'),
		backgroundOpacity: 1,
		hiddenOverflow: true,
		alignContent: 'left',
	});
	chatMainContainer.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.json',
	});
	chatContainer.add(chatMainContainer);

	const sendBtnContainer = new ThreeMeshUI.Block({
		padding: 0.02,
		width: 0.17,
		height: 0.4,
		backgroundOpacity: 0,
		hiddenOverflow: true,
		alignContent: 'center',
		interLine: 0.05,
	});

	const sendButton = new ThreeMeshUI.InlineBlock({
		height: 0.1,
		width: 0.1,
		borderRadius: [0, 0, 0, 0],
	});
	textureLoader.load('chatbox/send-white.svg', (texture) => {
		sendButton.set({ backgroundTexture: texture });
	});
	sendBtnContainer.add(sendButton);
	chatContainer.add(sendBtnContainer);
	chatBoxObject.add(chatContainer);
	chatContainer.position.copy(new Vector3(0, -1.12, 0));

	const userContainer = new ThreeMeshUI.Block({
		height: 2.23,
		width: 0.8,
		padding: 0.1,
		borderRadius: [0.05, 0.05, 0.05, 0.05],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		hiddenOverflow: true,
		justifyContent: 'start',
	});
	userContainer.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.png'
	});

	const globalButton = new ThreeMeshUI.Block({
		height: 0.1,
		width: 0.6,
		borderRadius: [0.05, 0.05, 0.05, 0.05],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#424242'),
		hiddenOverflow: true,
		justifyContent: 'center',
	});
	const globalText = new ThreeMeshUI.Text({
		content: "Global",
	})
	globalButton.add(globalText);
	userContainer.add(globalButton);

	const userMainContainer = new ThreeMeshUI.Block({
		height: 1.93,
		width: 0.7,
		borderRadius: [0, 0, 0, 0],
		backgroundOpacity: 0,
		padding: 0.05,
		hiddenOverflow: true,
	});
	userContainer.add(userMainContainer);

	const userScrollContainer = new ThreeMeshUI.Block({
		height: 1.93,
		width: 0.6,
		borderRadius: [0, 0, 0, 0],
		backgroundOpacity: 0,
		interLine: 0.05,
	});
	userMainContainer.add(userScrollContainer);
	chatBoxObject.add(userContainer);
	userContainer.rotation.y = 0.35;
	userContainer.position.copy(new Vector3(-1.5, -0.26, 0.15));






	// NEW blocks
	const emojiButton = new ThreeMeshUI.InlineBlock({
		height: 0.1,
		width: 0.1,
		borderRadius: [0, 0, 0, 0],
	});
	textureLoader.load('chatbox/emoji-button.svg', (texture) => {
		emojiButton.set({ backgroundTexture: texture });
	});
	sendBtnContainer.add(emojiButton);

	const emojiContainer = new ThreeMeshUI.Block({
		height: 0.8,
		width: 0.98,
		padding: 0.04,
		borderRadius: [0.05, 0.05, 0.05, 0.05],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		hiddenOverflow: true,
		alignItems: 'center',
		justifyContent: 'start',
	});
	emojiContainer.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.png'
	});
	emojiContainer.rotation.y = -0.35;
	// emojiContainer.position.set(1.57, -0.97, 0.23);
	emojiContainer.position.copy(new Vector3(1.57, -0.97, 0.23));
	chatBoxObject.add(emojiContainer)

	const emojiScrollContainer = new ThreeMeshUI.Block({
		height: 0.72,
		width: 0.90,
		padding: 0,
		margin: 0,
		hiddenOverflow: true,
		borderRadius: [0, 0, 0, 0],
		backgroundOpacity: 0,
	});
	emojiContainer.add(emojiScrollContainer)
	emojiContainerID = emojiScrollContainer.uuid;

	const emojiPopUpContainer = new ThreeMeshUI.Block({
		width: 0.8,
		padding: 0.04,
		borderRadius: [0.05, 0.05, 0.05, 0.05],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		hiddenOverflow: true,
		alignItems: 'start',
		justifyContent: 'start',
	});

	// 一開始隱藏
	emojiPopUpContainer.visible = false;
	emojiPopUpContainer.rotation.y = -0.35;
	emojiPopUpContainer.position.copy(new Vector3(1.54, -0.15, 0.30));
	chatBoxObject.add(emojiPopUpContainer)

	// Close 按鍵
	const emojiReturnButton = new ThreeMeshUI.Block({
		height: 0.1,
		width: 0.24,
		borderRadius: [0.02, 0.02, 0.02, 0.02],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		alignContent: 'center',
		justifyContent: 'center',
		borderOpacity: 0,
		borderWidth: 0.002,
		borderColor: new THREE.Color(0xFFFFFF),
	});
	emojiReturnButton.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.png'
	});
	emojiReturnButton.add(new ThreeMeshUI.Text({
		content: "Close",
	}))
	emojiReturnButton.rotation.y = -0.35;
	emojiReturnButton.position.copy(new Vector3(2.2, -0.4, 0.50));
	chatBoxObject.add(emojiReturnButton)
	objsToTest.push(emojiReturnButton)
	emojiReturnButton.visible = false;

	// States
	emojiReturnButton.setupState({
		state: 'selected',
		attributes: {},
		onSet: () => {
			emojiPopUpContainer.visible = false;
			emojiReturnButton.visible = false;
			clearEmojiPopUp();
		}
	});
	emojiReturnButton.setupState(hoveredStateAttributes);
	emojiReturnButton.setupState(idleStateAttributes);

	// Up 按鍵
	const upButton = new ThreeMeshUI.Block({
		height: 0.1,
		width: 0.2,
		borderRadius: [0.02, 0.02, 0.02, 0.02],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		alignContent: 'center',
		justifyContent: 'center',
		borderOpacity: 0,
		borderWidth: 0.002,
		borderColor: new THREE.Color(0xFFFFFF),
	});
	upButton.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.png'
	});
	upButton.add(new ThreeMeshUI.Text({
		content: "Up",
	}))
	upButton.rotation.y = -0.35;
	upButton.position.copy(new Vector3(2.2, -0.7, 0.50));
	chatBoxObject.add(upButton)
	objsToTest.push(upButton)

	// States
	upButton.setupState({
		state: 'selected',
		attributes: {},
		onSet: () => {
			emojiScrollContainer.position.y -= 0.1;
		}
	});
	upButton.setupState(hoveredStateAttributes);
	upButton.setupState(idleStateAttributes);

	// Down 按鍵
	const downButton = new ThreeMeshUI.Block({
		height: 0.1,
		width: 0.2,
		borderRadius: [0.02, 0.02, 0.02, 0.02],
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color('#757575'),
		alignContent: 'center',
		justifyContent: 'center',
		borderOpacity: 0,
		borderWidth: 0.002,
		borderColor: new THREE.Color(0xFFFFFF),
	});
	downButton.set({
		fontFamily: './fonts/Yahei-msdf.json',
		fontTexture: './fonts/Yahei-msdf.png'
	});
	downButton.add(new ThreeMeshUI.Text({
		content: "Down",
	}))
	downButton.rotation.y = -0.35;
	downButton.position.copy(new Vector3(2.2, -0.85, 0.50));
	chatBoxObject.add(downButton)
	objsToTest.push(downButton)

	// States
	downButton.setupState({
		state: 'selected',
		attributes: {},
		onSet: () => {
			emojiScrollContainer.position.y += 0.1;
		}
	});
	downButton.setupState(hoveredStateAttributes);
	downButton.setupState(idleStateAttributes);

	let emojiPopUpID = [];
	

	let proceed = true;
	const intervalID0 = setInterval(() => {
		if (proceed)
		{
			AddEmoji("Smileys & Emotion");
			clearInterval(intervalID0);
		}
	},100);
	const intervalID1 = setInterval(() => {
		if (proceed) {
			AddEmoji("People & Body");
			clearInterval(intervalID1);
		}
	}, 100);
	const intervalID2 = setInterval(() => {
		if (proceed)
		{
			AddEmoji("Animals & Nature");
			clearInterval(intervalID2);
		}
	},100);
	const intervalID3 = setInterval(() => {
		if (proceed)
		{
			AddEmoji("Food & Drink");
			clearInterval(intervalID3);
		}
	},100);
	const intervalID4 = setInterval(() => {
		if (proceed)
		{
			AddEmoji("Travel & Places");
			clearInterval(intervalID4);
		}
	},100);
	const intervalID5 = setInterval(() => {
		if (proceed)
		{
			AddEmoji("Activities");
			clearInterval(intervalID5);
		}
	},100);
	const intervalID6 = setInterval(() => {
		if (proceed)
		{
			AddEmoji("Objects");
			clearInterval(intervalID6);
		}
	},100);
	const intervalID7 = setInterval(() => {
		if (proceed)
		{
			AddEmoji("Symbols");
			clearInterval(intervalID7);
		}
	},100);
	const intervalID8 = setInterval(() => {
		if (proceed)
		{
			AddEmoji("Flags");
			clearInterval(intervalID8);
		}
	},100);

	chatBoxObject.position.copy(new Vector3(0, 3, 0));

	AddMessage('1');
	AddMessage('2');
	AddMessage('3');
	AddMessage('4');
	AddMessage('5');
	AddMessage('6');
	AddUserButton('User 1');
	AddUserButton('User 2');
	AddUserButton('User 3');
	AddUserButton('User 4');
	AddUserButton('User 5');
	AddUserButton('User 6');
	AddUserButton('User 1');
	AddUserButton('User 2');
	AddUserButton('User 3');
	AddUserButton('User 4');
	AddUserButton('User 5');
	AddUserButton('User 6');
	AddUserButton('User 1');
	AddUserButton('User 2');
	AddUserButton('User 3');
	AddUserButton('User 4');
	AddUserButton('User 5');
	AddUserButton('User 6');

	scene.add(chatBoxObject)
	
	
	function AddEmoji(category) {
		proceed = false;

		const categoryNameContainer = new ThreeMeshUI.InlineBlock({
			height: 0.08,
			width: 0.78,
			backgroundOpacity: 0,
			hiddenOverflow: true,
			justifyContent: "center",
			textAlign: "left",
		});
		const icon = new ThreeMeshUI.InlineBlock({
			height: 0.07,
			width: 0.07,
			borderRadius: [0, 0, 0, 0],
			justifyContent: 'end',
			hiddenOverflow: true,
		});
		textureLoader.load(`SVG/${category}_icon.svg`, (texture) => {
			icon.set({
				backgroundTexture: texture,
				backgroundSize: 'contain',
			})
		});
		categoryNameContainer.add(icon);
		const categoryName = new ThreeMeshUI.InlineBlock({
			height: 0.08,
			width: 0.71,
			backgroundOpacity: 0,
			hiddenOverflow: true,
			justifyContent: "center",
			textAlign: "left",
		});
		categoryName.add(new ThreeMeshUI.Text({
			content: `\xa0${category}`.toUpperCase(),
		}))
		categoryNameContainer.add(categoryName);

		emojiScrollContainer.add(categoryNameContainer);


		let names;
		let emojiRowContainer;
		let filenameIndex = 0;
		fetch(`./SVG/${category}.txt`)
			.then((res) => res.text())
			.then((text) => { names = text.split('\n'); })
			.then(() => {
				for (let i = 0; filenameIndex < names.length; i++) {
					// 新一行
					if (i % 6 == 0) {
						emojiRowContainer = new ThreeMeshUI.InlineBlock({
							height: 0.12,
							width: 0.78,
							backgroundOpacity: 0,
							alignContent: 'left',
						});
						emojiScrollContainer.add(emojiRowContainer);
					}

					const emoji = new ThreeMeshUI.InlineBlock({
						height: 0.08,
						width: 0.08,
						borderRadius: [0, 0, 0, 0],
						hiddenOverflow: true,
						borderOpacity: 0,
						borderWidth: 0.002,
						borderColor: new THREE.Color(0xFFFFFF),

					});

					textureLoader.load(`./SVG/${category}/${names.at(filenameIndex)}`, (texture) => {
						emoji.set({
							backgroundTexture: texture,
							backgroundSize: 'contain',

						})
					});
					emojiRowContainer.add(emoji);

					if (i % 6 != 5) {
						emojiRowContainer.add(new ThreeMeshUI.InlineBlock({
							width: 0.06,
							height: 0.08,
							borderRadius: [0, 0, 0, 0],
							hiddenOverflow: true,
							backgroundOpacity: 0,
						}))
					}

					// 需要彈出視窗
					if (nameMap.has(names.at(filenameIndex))) {
						// 儲存彈出視窗emoji的資訊
						// info.category, info.numOfEmojis
						let info = nameMap.get(names.at(filenameIndex));

						// 彈出視窗emoji的名稱
						let filenameArray = []
						for (let i = filenameIndex; i < filenameIndex + info.numOfEmojis; i++) {
							filenameArray.push(names.at(i));
						}
						filenameIndex += info.numOfEmojis;

						let emojiPopUpRowContainer;

						// Parent (emojiScrollContainer裏的emoji)
						emoji.setupState({
							state: 'selected',
							attributes: {},
							onSet: () => {
								clearEmojiPopUp();
								
								// Child (Pop up裏的emoji)
								// 6個一行
								for (let j = 0; j < info.numOfEmojis; j++) {
									if (j % 6 == 0) {
										emojiPopUpRowContainer = new ThreeMeshUI.InlineBlock({
											height: 0.12,
											width: 0.72,
											backgroundOpacity: 0,
											alignContent: 'left',
										});
										emojiPopUpContainer.add(emojiPopUpRowContainer);
									}
									const emojiPopUp = new ThreeMeshUI.InlineBlock({
										height: 0.08,
										width: 0.08,
										borderRadius: [0, 0, 0, 0],
										hiddenOverflow: true,
										borderOpacity: 0,
										borderWidth: 0.002,
										borderColor: new THREE.Color(0xFFFFFF),
									});
									textureLoader.load(`./SVG/${info.category}/${filenameArray[j]}`, (texture) => {
										emojiPopUp.set({
											backgroundTexture: texture,
											backgroundSize: 'contain',
										})
									});
									
									const emojiPathName = `./SVG/${info.category}/${filenameArray[j]}`
									AddEmojiToChatbox(emojiPopUp, emojiPathName)
									
									// 之後要從objsToTest移除emojiPopUp，記下要移除的id
									emojiPopUpID.push(emojiPopUp.uuid);
									emojiPopUpRowContainer.add(emojiPopUp);
									
									if (j % 6 != 5) {
										emojiPopUpRowContainer.add(new ThreeMeshUI.InlineBlock({
											width: 0.048,
											height: 0.08,
											borderRadius: [0, 0, 0, 0],
											hiddenOverflow: true,
											backgroundOpacity: 0,
										}))
									}
								}
								emojiPopUpContainer.visible = true;
								emojiReturnButton.visible = true;
							}
						});
						emoji.setupState(hoveredStateAttributes);
						emoji.setupState(idleStateAttributes);
						objsToTest.push(emoji);
					}

					// 不需要彈出視窗
					else {
						const emojiPathName = `./SVG/${category}/${names.at(filenameIndex)}`
						AddEmojiToChatbox(emoji, emojiPathName);
						filenameIndex++;
					}
				}
			})
			.then(() => {
				proceed = true
				console.log(`Finish loading ${category}`);
			})
			.catch((e) => console.error(e));
	}

	function AddEmojiToChatbox(obj, emojiPathName) {
		obj.setupState({
			state: 'selected',
			attributes: {},
			onSet: () => {
				textureLoader.load(emojiPathName, (texture) => {
					const emojiChatbox = new ThreeMeshUI.InlineBlock({
						height: 0.05,
						width: 0.05,
						borderRadius: [0, 0, 0, 0],
						hiddenOverflow: true,
					});
					emojiChatbox.set({
						backgroundTexture: texture,
						backgroundSize: 'contain'
					});
					chatMainContainer.add(emojiChatbox);
				});
			}
		});
		obj.setupState(hoveredStateAttributes);
		obj.setupState(idleStateAttributes);
		objsToTest.push(obj);
	}

	function AddMessage(message) {
		const chatContainer = new ThreeMeshUI.InlineBlock({
			width: 1.8,
			borderRadius: [0.05, 0.05, 0.05, 0.05],
			backgroundColor: new THREE.Color('#424242'),
			backgroundOpacity: 1,
			alignContent: 'center',
		});
		chatScrollContainer.add(chatContainer);

		const headerContainer = new ThreeMeshUI.Block({
			height: 0.15,
			width: 1.8,
			backgroundOpacity: 0,
			hiddenOverflow: true,
			contentDirection: "row",
			justifyContent: "start",
			alignItems: "center",
		});
		chatContainer.add(headerContainer);

		const avatarContainer = new ThreeMeshUI.Block({
			height: 0.15,
			width: 0.15,
			backgroundOpacity: 0,
			hiddenOverflow: true,
			justifyContent: "center",
			textAlign: "center",
		});

		const nameContainer = new ThreeMeshUI.Block({
			height: 0.1,
			width: 0.5,
			backgroundOpacity: 1,
			backgroundColor: new THREE.Color('#4590b3'),
			hiddenOverflow: true,
			justifyContent: "center",
			textAlign: "center",
		});

		headerContainer.add(avatarContainer);
		headerContainer.add(nameContainer);

		chatContainer.add(headerContainer);

		const contentContainer = new ThreeMeshUI.Block({
			width: 1.6,
			height: 0.25,
			padding: 0.02,
			backgroundOpacity: 0,
			hiddenOverflow: true,
			justifyContent: "center",
			alignContent: 'left',
		});
		chatContainer.add(contentContainer);




		const textureLoader = new TextureLoader();
		const avatar = new ThreeMeshUI.InlineBlock({
			height: 0.1,
			width: 0.1,
		});
		textureLoader.load("https://api.vrpanda.org/uploads/public_icon/avatar/47.jpg", (texture) => {
			avatar.set({ backgroundTexture: texture });
		})
		const nameText = new ThreeMeshUI.Text({
			content: "Name",
		});
		avatarContainer.add(avatar);
		nameContainer.add(nameText);

		const contentText = new ThreeMeshUI.Text({
			content: message,
		});

		contentContainer.add(contentText);

		chatContainer.onAfterUpdate = () => {
			if (chatContainer.height !== chatContainer.size.height) {
				chatContainer.height = chatContainer.size.height;
			}
		}
		return chatContainer;
	}

	function AddUserButton(name) {
		const userButton = new ThreeMeshUI.InlineBlock({
			height: 0.1,
			width: 0.6,
			borderRadius: [0.05, 0.05, 0.05, 0.05],
			backgroundOpacity: 1,
			backgroundColor: new THREE.Color('#424242'),
			hiddenOverflow: true,
			justifyContent: 'center',
		});
		const nameText = new ThreeMeshUI.Text({
			content: name,
		})
		userButton.add(nameText);
		userScrollContainer.add(userButton);
	}

	function clearEmojiPopUp() {
		// 移除不用的按鈕
		for (let id = 0; id < emojiPopUpID.length; id++) {
			for (let k = 0; k < objsToTest.length; k++) {
				if (objsToTest[k] == undefined) continue;
				if (objsToTest[k].uuid === emojiPopUpID[id]) {
					objsToTest.splice(k, 1);
				}
			}
		}
		for (let k = emojiPopUpContainer.children.length - 1; k >= 0; k--) {
			if (emojiPopUpContainer.children[k].isInlineBlock) {
				emojiPopUpContainer.remove(emojiPopUpContainer.children[k]);
			}
		}
		emojiPopUpID = []
	}
};



const animate = function () {
	requestAnimationFrame(animate);

	ThreeMeshUI.update();

	controls.update();

	renderer.render(scene, camera);

	updateButtons();
};

function updateButtons() {
	// The closest intersecting object
	let intersect;

	if (mouse.x !== null && mouse.y !== null) {
		raycaster.setFromCamera(mouse, camera);

		intersect = raycast();
	}

	// Update button state
	if (intersect && intersect.object.isUI) {
		if (selectState) 
		{
			intersect.object.setState('selected');
		} 
		else 
		{
			intersect.object.setState('hovered');
		}
	}

	objsToTest.forEach((obj) => {
		if ((!intersect || obj !== intersect.object) && obj.isUI) {
			obj.setState('idle');
		}
	});
}

//

function raycast() {
	// go through objsToTest, obj is the current obj
	return objsToTest.reduce((closestIntersection, obj) => {
		// sorted by distance
		position.setFromMatrixPosition(obj.matrixWorld);
		
		// 不要選擇已overflow的按鈕
		if (obj?.parent?.parent?.uuid === emojiContainerID && (position.y <= 1.65 || position.y >= 2.5)) {

			return closestIntersection;
		}
		const intersection = raycaster.intersectObject(obj, true);

		if (!intersection[0]) return closestIntersection;

		if (!closestIntersection || intersection[0].distance < closestIntersection.distance) {
			intersection[0].object = obj;
			return intersection[0];
		}
		return closestIntersection;
	}, null);
}




















// content: "春你現刀河了壯訴魚，松問頭平比幼長飛告申汁五安年爪圓明扒、原視已雲林雪視念走良飯怕父牛奶「習各拍勿」民圓南馬。條物五幫頭辛，直時豆麼水父前幸外升穿，喝九寺不，用植不。意大兄裏斤，種帽怎！道八回飽假文裝背種急鴨內話南巴六幼發訴國。幸想共結背更天片動都候，新王那至合法開得蝸面語包。房胡員唱沒干千次：對皮走。她公文樹游娘象。勿道冒。玩太詞氣京南瓜次至年主木河、就北娘美土首事北第：几在每貝追巴幸室晚愛走告林司能根月有。同邊頭用什洋升現波兌足習聲旦到。事奶邊三音福條羽林信，動英聽，話早朵竹，寸音福，貫好亮詞忍，高司百春連道急前兄鴨。門斤行爬爸牠刀反十竹門、尤耍拍門追冒遠誰神：至吃元工拉家，歌八用院定游弓牛兌羽王法男時王目借相快植，意事樹不坐流幫汗定因！即科汁工裏詞前犬抄麼松雲急，何休怕對？錯尺也，點夏羽雪知，怪點假。支福哭扒山西公雞屋？身內月刀毛勿卜弟休珠忍書信親您哥但：弟母冒清活叫固說起「止年子村或封力」心太每香錯你弟汁，姐同方頁姊。兔木旁相友片洋到采戶勿教羽吹左點呢大問。枝意雄朱動同瓜飛路。對海您九皮。見奶枝哭喜田林完消紅帽又！羊園借昔種起刀力時看片反右央圓？入科書點放兌！田四果坐；植找飛。以习家是座曾元的保物得业，二引画立？好年统在。不会在有经万题其下河力检界师第，银公命配德风儿不美只次分？候视质心故音起说。得香关几自园我师政无民个……资这定界虽北门业，中因率。背海人二演对现叶家童受最洋的感后因那不建得住前他共兴了济；活家讲温这告西医方观文车子面破的领北麽巴成最上行身具出青连表爱使大共学足成要保：流整下只、了手和虽？的案我，意戏考天已离节马是，更看来，起得卖湾意的赛党时统读方华市的正天步对买条我子升而有天故造成心前不一空然往，地前开，查前世生老查看日民早调……类实白无大比是建发好出……风经界乐没省观。这己因远般、地出是走才！当来定直以时金、类实照经满备起者宝世居下他成营等境选重会后强通功脚消得道是！连外我成有美开子时海的院有马。发常小、人园动我山太国已政臺市，好下年里不说妈初中试年：感坡孩第被果、明财上地组你、力研康过一一？动美心自电眼来动一……整过作命度质他力成国回会来少时而告解用部不有目湾知事案岸出销不断门。至同重了还爸北当电场上老进中可线了了还……脸阿就，知在收源体形少球物十行水统往一为臺古为。书社我清于，很后被经底像用是道但量福是治们流小。灯定主……己没能可示企我因学时买哥女长知起轻发国原神国自他、子养旅举因职实天见在论生母……班不来相由流利里……争共心？失空自大源气师。代轻整有可严强起年利中认亲报他关们更工头师中。他东土美知就亚种戏会我会，地知然期细军闻天长，假受本製空日能我许吃一立西境年差机白做客听地我民对无包开却气现之中笑了种世安乎个新小长像学，的导环写多，影容亲由地。经传认们带写值无到世喜云办在股高班小的教，待处条思一视天育我新，光合我自朋。也望第加须水车，而们务国康如不接取！思然这主达以场物的视一当、必国细人、臺候子个。后安些高像报了来不不非。眼员心头两从外你定电绝后且的历……因之入常孩经我看基好事，谈可术门发麽目比笑。早什客本形这母世文作投书的展地生家际机象。们通化指里，把自艺点国年一心力散们成来研出书越灵。重向企活赛是长儿。生选日工上术书样压但非，员做开，别果惊心只人，为办情格面好，友水样器，自接的公北，指女天待示。王不闻。备目告，中于东音李先人考是开个但虽行可的：失臺直数哥清影成查人：一所前草子；不论去观留给情进水指、站她没争四问统年家以物个，好写管员！玩全立技益刻二与最己我说人资绝了上关不，民念变走我天些外河的多关到雨两题到型子字玩火你的开适在当人员出养常明出高引本亮！包生轻那经一由性料手平那妈计子说及不民道当国亚候世……同发满根他半英样源画就童生作奖长应游会待动要国不际线决……果着理争，参政他且人等大。其国日，去灵生说三实生怎、话突影府为，动量致。该时年、众有应是处再前面，阿感大的老跑不华也其一见城臺。回德来白这到一进了是就认了年员得队事电技金照车麽生，长去银细得体开科月……际资家支流太来识话知样直，同约父来不！古格者家众父反另响国黑，名叫的事气到多有此有生热同城常西只国公。院起持晚体顾斯间。中语度在活湾外信为；学校夫年年动结者心国湾，中表动无把立老断有都受……夜大商是买程分成的夫于学我领。麽做有现油：全学子出是事知的。国因红来得政世的？道美因息充山题心成是文传麽慢早指中里你界？復推外价行大力知回都意爸演死：比以性内心母，师的好常北开者门造？经还价直的国声定量无。山然就远，人绝史我由验？臺走中是来们笑了高的其才界事喜农传不轻备久前笑了广，所不用动！是孩製二它何因楼还洲给是呢？我静出。银同事？成商男方山酒见同可着：又手告，一有不树光木人：特说香半出停，气原工学日可变在事推条！力民作几半的闻几回的我好妈；内不工生点过计天地是个中越亮的的长义目取统注过她……以春相海手爸，证自间他世，汽样出致你程，饭例食得北物县感；陆房你助为对同是经买人处；由会算民立湾请身注，日们日小明时年时性当呢龙不怕市。儿全必：谢人你战拿，伤受大解的多动足自黑主：企是个，道长景国实资行。想同童社供团服成，水层。臺又子是看说可、众好东种外他会成，在友甚。来是共引很，在小的会民两：之色广说我友这居告艺理推名一事特这作未臺已我，家文们？华过己位，先红对本来一，却让政理传！显高。果车的那它美的路风乐县角解重了工，容外半到声一青车投长的果应法的，到电心，原原机叫已前所确写身在外价不信字或资有！府是动去手地！我府示重智除为英人，策力展：品心标、臺音目形！"