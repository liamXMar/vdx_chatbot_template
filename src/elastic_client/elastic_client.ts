import { Client } from 'es7';
import * as dotenv from "dotenv";
import { transformObject, renameFields, sortObjectKeysAlphabetically } from './utils';
const util = require('util');

dotenv.config();

const client = new Client({
	node: process.env.ES_URL,
	auth: {
		username: process.env.ES_USERNAME || '',
		password: process.env.ES_PASSWORD || ''
	}
});

const fieldMappings = {
	"@timestamp": "Timestamp",
	"labels.call_id": "Call_Id",
	"event.action": "Call_Type",
	"event.reason": "Poor_Call_Reasons",
	"event.outcome": "Call_Outcome",
	"labels.teams_meeting_room.count_device_critical": "Meeting_Critical_Device_Count",
	"labels.teams_meeting_room.count_device_healthy": "Meeting_Healthy_Device_Count",
	"labels.teams_meeting_room.count_device_total": "Meeting_Total_Device_Count",
	"labels.teams_meeting_room.display_name": "Meeting_Room_Name",
	"source.user.name": "User_Name",
	"source.user.id": "User_Email",
	"source.geo.name": "User_Location",
	"source.vdx_audio_capture_device": "User_Audio_Device",
	"source.vdx_bandwidth": "User_Bandwidth",
	"source.vdx_cpu_system_usage": "User_System_Cpu_Usage",
	"source.vdx_cpu_teams_usage": "User_Teams_Cpu_Usage",
	"source.vdx_detected_location": "User_Remote_Or_Office",
	"source.vdx_internet_connection_type": "User_Connetion_Type",
	"source.vdx_jitter": "User_Jitter",
	"source.vdx_memory_system_usage": "User_System_Memory_Usage",
	"source.vdx_memory_teams_usage": "User_Teams_Memory_Usage",
	"source.vdx_packet_loss": "User_Packet_Loss",
	"source.vdx_rtt": "User_Round_Trip_Time",
	"source.vdx_teamsclient": "User_Teams_Client",
	"source.vdx_user_rating": "User_Call_Rating",
	"vdx_call_metrics.averagebandwidth": "Call_Average_Bandwidth",
	"vdx_call_metrics.averagejitter": "Call_Average_Jitter",
	"vdx_call_metrics.averagepacketloss": "Call_Average_Packet_Loss",
	"vdx_call_metrics.averagerating": "Call_Average_Rating",
	"vdx_call_metrics.averagesystemcpuusage": "Call_Average_System_Cpu_Usage",
	"vdx_call_metrics.averageteamscpuusage": "Call_Average_Teams_Cpu_Usage",
	"vdx_call_metrics.connnectiontypes": "Call_Connection_Types",
	"vdx_call_metrics.networkswitching": "Call_Network_Switching",
	"vdx_call_metrics.teams_clients": "Call_Teams_Client",
	"vdx_call_metrics.transporttypes": "Call_Transport_Type",
	"vdx_call_metrics.wifisignalstrengths": "Call_Wifi_Signal_Strengths",
	"vdx_call_metrics.work_location": "Call_Work_Locations"
};


client.search({
	index: '*events_teams_cqd_legs*',
	body: {
		"size": 500,
		query: {
			"range": {
				"@timestamp": {
					"gte": "now-24h",
					"lte": "now"
				}
			}
		},
		"fields": [
			"@timestamp",
			"labels.call_id",
			"event.action",
			"event.reason",
			"event.outcome",
			"labels.teams_meeting_room.count_device_critical",
			"labels.teams_meeting_room.count_device_healthy",
			"labels.teams_meeting_room.count_device_total",
			"labels.teams_meeting_room.display_name",
			"source.user.name",
			"source.user.id",
			"source.geo.name",
			"source.vdx_audio_capture_device",
			"source.vdx_bandwidth",
			"source.vdx_cpu_system_usage",
			"source.vdx_cpu_teams_usage",
			"source.vdx_detected_location",
			"source.vdx_internet_connection_type",
			"source.vdx_jitter",
			"source.vdx_memory_system_usage",
			"source.vdx_memory_teams_usage",
			"source.vdx_packet_loss",
			"source.vdx_rtt",
			"source.vdx_teamsclient",
			"source.vdx_user_rating",
			"vdx_call_metrics.averagebandwidth",
			"vdx_call_metrics.averagejitter",
			"vdx_call_metrics.averagepacketloss",
			"vdx_call_metrics.averagerating",
			"vdx_call_metrics.averagesystemcpuusage",
			"vdx_call_metrics.averageteamscpuusage",
			"vdx_call_metrics.connnectiontypes",
			"vdx_call_metrics.networkswitching",
			"vdx_call_metrics.teams_clients",
			"vdx_call_metrics.transporttypes",
			"vdx_call_metrics.wifisignalstrengths",
			"vdx_call_metrics.work_location"
		]
	}
}, (err, result) => {
	if (err) console.log(err)
	else {
		/*result.body.hits.hits.forEach(h => {
			console.log(util.inspect(transformObject(h.fields), { showHidden: false, depth: null, colors: true }))
		});*/

		var res = result.body.hits.hits.map(h => sortObjectKeysAlphabetically(renameFields(transformObject(h.fields), fieldMappings)));
		console.log(util.inspect(res, fieldMappings), { showHidden: false, depth: null, colors: true });
		//console.log(util.inspect(result.body.hits, { showHidden: false, depth: null, colors: true }));
	}
});