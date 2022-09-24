// Page 11
enum CommandAcknowledgeMessageByte {
    PROCESSED_SUCCESSFULLY = 0x00,
    DELAYED_UNTIL_NETWORK_ONLINE = 0x01,
    ADDRESS_OUT_OF_RANGE = 0x02,
    UNKNOWN_COMMAND = 0x03,
};
export class CommandAcknowledge {
    messageByte: CommandAcknowledgeMessageByte;
    data: number;
};

// Page 12
enum ServiceRequestMessageByte {
    SENSOR_CHANGED_STATE = 0x81,
    NETWORK_COMMUNICATION_LOST = 0x82,
};
export class ServiceRequest {
    messageByte: ServiceRequestMessageByte;
};



enum OpCode {
    ACTIVATE_CONTROL = 0x01,
    DEACTIVATE_COMMAND = 0x02,
    CONFIGURE_SENSOR = 0x10,
    READ_ALL_SENSORS = 0x14,
    RESET_NETWORK = 0x15,
    NETWORK_ONLINE = 0x16,
    NETWORK_OFFLINE = 0x17,
    POLL_NETWORK = 0x18,
    READ_VERSION = 0x19,
};

enum ModuleType {
    TRAIN_BRAIN = 1,
    DASH_8 = 2,
    WATCHMAN = 3,
    SIGNALMAN = 4,
    SMART_CAB = 5,
    SWITCHMAN = 6,
    YARD_MASTER = 7,
    SENTRY = 8,
    UNRECOGONIZED_MODULE = 255,
};

abstract class AbstractCommand {
    abstract readonly opCode: OpCode;

    abstract getCommandValue(): number;

    getCommandBinary(): string {
        return this.getCommandValue().toString(2);
    }
}

abstract class AbstractSimpleCommand extends AbstractCommand {
    getCommandValue(): number {
        return this.opCode;
    };
};



// page 13
export class ActivateCommand extends AbstractCommand {
    readonly opCode = OpCode.ACTIVATE_CONTROL;

    controlAddress: number;

    getCommandValue(): number {
        return this.opCode << 16 | this.controlAddress;
    }
}
export class DeactivateCommand extends AbstractCommand {
    readonly opCode = OpCode.DEACTIVATE_COMMAND;

    controlAddress: number;

    getCommandValue(): number {
        return this.opCode << 16 | this.controlAddress;
    }
};

// page 24
enum SensorFilterThreshold {
    LIGHTLY_FILTERED = 0b00000,
    HEAVILY_FILTERED = 0b11111,
};
enum SensorFilterSelect {
    NOISE_FILTER_ONLY = 0b00,
    SWITCH_BOUNCE = 0b01,
    CAR_GAB = 0b10,
    DIRTY_TRACK = 0b011,
};
enum SensorPolarity {
    NORMAL = 0b0,
    INVERTED = 0b1,
};
export class ConfigureSensorCommand extends AbstractCommand {
    readonly opCode = OpCode.CONFIGURE_SENSOR;

    sensorAddress: number;
    filterThreshold: SensorFilterThreshold;
    filterSelect: SensorFilterSelect;
    polarity: SensorPolarity;
    
    getCommandValue(): number {
        return this.opCode << 32 | this.sensorAddress << 8
            | this.filterThreshold << 3 | this.filterSelect << 1 | this.polarity;
    }
}
export class ConfigureSensorResponse {

}

// page 28
export class ReadAllSensorsCommand extends AbstractSimpleCommand {
    readonly opCode = OpCode.READ_ALL_SENSORS;
}
export class ReadAllSensorsResponse {
    byteCount: number;
    dataBytes: number[];
    sensorStates: boolean[];
}

// page 30
export class ResetNetworkCommand extends AbstractSimpleCommand {
    readonly opCode = OpCode.RESET_NETWORK;
};
export class ResetNetworkResponse {

}

export class NetworkOnlineCommand extends AbstractSimpleCommand {
    readonly opCode = OpCode.NETWORK_ONLINE;
};
export class NetworkOnlineResponse {

}

export class NetworkOfflineCommand extends AbstractSimpleCommand {
    readonly opCode = OpCode.NETWORK_OFFLINE;
};
export class NetworkOfflineResponse {

}

// page 31
export class PollNetworkCommand extends AbstractSimpleCommand {
    readonly opCode = OpCode.POLL_NETWORK;
};
export class PollNetworkResponse {
    numberOfModules: number;
    modules: ModuleType[];
}

// page 32
export class ReadRevisionCommand extends AbstractSimpleCommand {
    readonly opCode = OpCode.READ_VERSION;
};
export class ReadRevisionResponse {
    majorRevision: number;
    minorRevision: number;
}