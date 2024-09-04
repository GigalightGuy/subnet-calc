function iptostr(ip) {
    const ipStr = ((ip >> 24) & 0xff).toString() + "." + 
                  ((ip >> 16) & 0xff).toString() + "." +
                  ((ip >>  8) & 0xff).toString() + "." +
                  ((ip      ) & 0xff).toString();
    return ipStr;
}

function process_addr(addrStr) {
    const substrings = addrStr.split("/");
    if (substrings.length != 2) {
        throw new Error("Malformed address! Should be of form 255.255.255.255/32");
    }
    const byteStrings = substrings[0].split(".");
    if (byteStrings.length != 4) {
        throw new Error("Malformed address! Should be of form 255.255.255.255/32");
    }
    const bytes = [parseInt(byteStrings[0]), parseInt(byteStrings[1]),
                   parseInt(byteStrings[2]), parseInt(byteStrings[3])];
    for (b in bytes) {
        if (b < 0 || b > 255) {
            throw new Error("Malformed address! Should be of form 255.255.255.255/32");
        }
    }
    const ip = (bytes[0] << 24 | 
                bytes[1] << 16 |
                bytes[2] <<  8 | 
                bytes[3]) >>> 0;

    const subnetBits = parseInt(substrings[1]) >>> 0;
    if (subnetBits > 32) {
        throw new Error("Subnet bits can't exceed 32!");
    }

    const hostBits = 32 - subnetBits;
    const totalHosts = 1 << hostBits >>> 0;
    const availableHosts = totalHosts - 2;
    
    const subnetMask    = (0xffffffff << hostBits) >>> 0;
    const netIdAddr     = (ip &  (subnetMask)) >>> 0;
    const broadcastAddr = (ip | ~(subnetMask)) >>> 0;

    const res = {
        subnet_mask: iptostr(subnetMask),
        netid_addr: iptostr(netIdAddr),
        broadcast_addr: iptostr(broadcastAddr),
        total_hosts: totalHosts,
        available_hosts: availableHosts,
    };
    return res;
}

function process_addr_from_input() {
    const input = document.getElementById("addr_input").value;
    try {
        const r = process_addr(input);
        document.getElementById("subnet_mask").value = r.subnet_mask;
        document.getElementById("netid_addr").value = r.netid_addr;
        document.getElementById("broadcast_addr").value = r.broadcast_addr;
        document.getElementById("total_hosts").value = r.total_hosts;
        document.getElementById("available_hosts").value = r.available_hosts;

        document.getElementById("error_message").hidden = true;
    } catch (e) {
        document.getElementById("subnet_mask").value = "";
        document.getElementById("netid_addr").value = "";
        document.getElementById("broadcast_addr").value = "";
        document.getElementById("total_hosts").value = "";
        document.getElementById("available_hosts").value = "";

        const elem = document.getElementById("error_message");
        elem.innerText = e;
        elem.hidden = false;
    }
}