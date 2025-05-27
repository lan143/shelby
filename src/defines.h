#pragma once

#define SERIAL_SPEED    115200

#define ETH_ADDR        0
#define ETH_POWER_PIN   -1
#define ETH_MDC_PIN     23
#define ETH_MDIO_PIN    18
#define ETH_TYPE        ETH_PHY_LAN8720
#define ETH_CLK_MODE    ETH_CLOCK_GPIO17_OUT

#define RELAY_GATE      2
#define RELAY_DRAWING   15

#define GATE_OPEN       36
#define GATE_CLOSE      39

#define EEPROM_SIZE     1024

const char deviceName[] = "Shelby";
const char deviceModel[] = "KC868-A2";
const char deviceManufacturer[] = "Kincony";
const char deviceHWVersion[] = "1.0.0";
const char deviceFWVersion[] = "0.1.0";
