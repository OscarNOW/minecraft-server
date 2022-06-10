import { EventEmitter } from 'events';

type Client = import('../utils/Client').Client;

export class Server extends EventEmitter {
    constructor(serverOptions: {
        serverList(info: {
            ip: string,
            version: version | null,
            connection: {
                host: string | null,
                port: number | null
            },
            legacy: boolean
        }): {
            version?: {
                wrongText?: string | Text;
                correct?: version;
            };
            players: {
                online: number;
                max: number;
                hover?: string | Array<{
                    name: string;
                    uuid: string;
                }>;
            };
            description?: string | Text;
        };
        wrongVersionConnect(info: {
            ip: string,
            version: newVersion | 'legacy',
            connection: {
                host: string | null,
                port: number | null
            },
            legacy: boolean
        }): string | Text | null;
    });

    private events: object;
    private server: any;

    readonly clients: Array<Client>;
    readonly playerCount: number;

    close(): void;

    on(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    addListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    once(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    prependListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    prependOnceListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    off(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    removeListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    removeAllListeners(event?: 'join' | 'leave'): void;
    rawListeners(event: 'join' | 'leave'): ((client: Client) => void)[];
}

type version = legacyVersion | newVersion;
type legacyVersion = '13w39b' | '13w39a' | '13w38c' | '13w38b' | '13w38a' | '1.6.4' | '1.6.3' | '13w37b' | '13w37a' | '13w36b' | '13w36a' | '1.6.2' | '1.6.1' | '1.6' | '13w26a' | '13w25c' | '13w25b' | '13w25a' | '13w24b' | '13w24a' | '13w23b' | '13w23a' | '13w22a' | '13w21b' | '13w21a' | '13w19a' | '13w18c' | '13w18b' | '13w18a' | '13w17a' | '13w16b' | '13w16a' | '1.5.2' | '1.5.1' | '13w12~' | '13w11a' | '1.5' | '13w10b' | '13w10a' | '13w09c' | '13w09b' | '13w09a' | '13w07a' | '13w06a' | '13w05b' | '13w05a' | '13w04a' | '13w03a' | '13w02b' | '13w02a' | '13w01b' | '13w01a' | '1.4.7' | '1.4.6' | '12w50b' | '12w50a' | '12w49a' | '1.4.5' | '1.4.4' | '1.4.3' | '1.4.2' | '1.4.1' | '1.4' | '12w42b' | '12w42a' | '12w41b' | '12w41a' | '12w40b' | '12w40a' | '12w39b' | '12w39a' | '12w38b' | '12w38a' | '12w37a' | '12w36a' | '12w34b' | '12w34a' | '12w32a' | '1.3.2' | '1.3.1' | '1.3' | '12w30e' | '12w30d' | '12w30c' | '12w30b' | '12w30a' | '12w27a' | '12w26a' | '12w25a' | '12w24a' | '12w23b' | '12w23a' | '12w22a' | '12w21b' | '12w21a' | '12w19a' | '12w18a' | '12w17a' | '12w16a' | '12w15a' | '1.2.5' | '1.2.4' | '1.2.3' | '1.2.2' | '1.2.1' | '1.2' | '12w08a' | '12w07b' | '12w07a' | '12w06a' | '12w05b' | '12w05a' | '12w04a' | '12w03a' | '1.1' | '12w01a' | '11w50a' | '11w49a' | '11w48a' | '11w47a' | '1.0.1' | '1.0.0' | 'RC2' | 'RC1' | 'Beta 1.9 Prerelease 6' | 'Beta 1.9 Prerelease 5' | 'Beta 1.9 Prerelease 4' | 'Beta 1.9 Prerelease 3' | 'Beta 1.9 Prerelease 2' | 'Beta 1.9 Prerelease' | 'Beta 1.8.1' | 'Beta 1.8' | 'Beta 1.8 Pre-release 2 ' | 'Beta 1.8 Pre-release' | 'Beta 1.7.3' | 'Beta 1.7.2' | 'Beta 1.7_01' | 'Beta 1.7' | 'Beta 1.6.6' | 'Beta 1.6.5' | 'Beta 1.6.4' | 'Beta 1.6.3' | 'Beta 1.6.2' | 'Beta 1.6.1' | 'Beta 1.6' | 'Beta 1.6 Test Build 3' | 'Beta 1.5_02' | 'Beta 1.5_01' | 'Beta 1.5' | 'Beta 1.4_01' | 'Beta 1.4' | 'Beta 1.3_01' | 'Beta 1.3' | 'Beta 1.2_02' | 'Beta 1.2_01' | 'Beta 1.2' | 'Beta 1.1_02' | 'Beta 1.1_01' | 'Beta 1.1' | 'Beta 1.0.2' | 'Beta 1.0_01' | 'Beta 1.0' | 'Alpha server 0.2.8' | 'Alpha v1.2.6' | 'Alpha server 0.2.7' | 'Alpha v1.2.5' | 'Alpha server 0.2.6_02' | 'Alpha v1.2.4_01' | 'Alpha server 0.2.6_01' | 'Alpha server 0.2.6' | 'Alpha v1.2.3_05' | 'Alpha v1.2.3_04' | 'Alpha server 0.2.5_02' | 'Alpha server 0.2.5_01' | 'Alpha v1.2.3_02' | 'Alpha v1.2.3_01' | 'Alpha server 0.2.5' | 'Alpha v1.2.3' | 'Alpha server 0.2.4' | 'Alpha v1.2.2' | 'Alpha v1.2.1_01' | 'Alpha server 0.2.3' | 'Alpha v1.2.1' | 'Alpha v1.2.0_02' | 'Alpha v1.2.0_01' | 'Alpha server 0.2.2_01' | 'Alpha server 0.2.2' | 'Alpha v1.2.0' | 'Alpha v1.1.2_01' | 'Alpha v1.1.2' | 'Alpha server 0.2.1' | 'Alpha v1.1.1' | 'Alpha server 0.2.0_01' | 'Alpha server 0.2.0' | 'Alpha v1.1.0' | 'Alpha v1.0.17_04' | 'Alpha v1.0.17_03' | 'Alpha v1.0.17_02' | 'Alpha server 0.1.4' | 'Alpha server 0.1.3' | 'Alpha v1.0.16_02' | 'Alpha server 0.1.2_01' | 'Alpha server 0.1.2' | 'Alpha v1.0.16_01' | 'Alpha server 0.1.1' | 'Alpha v1.0.16' | 'Alpha server 0.1.0' | 'Alpha v1.0.15' | 'Alpha v1.0.14' | 'Alpha v1.0.13_01' | 'Alpha v1.0.13' | 'Alpha v1.0.12' | 'Alpha v1.0.11' | 'Alpha v1.0.10' | 'Alpha v1.0.9' | 'Alpha v1.0.8_01' | 'Alpha v1.0.8' | 'Alpha v1.0.7' | 'Alpha v1.0.6_03' | 'Alpha v1.0.6_02' | 'Alpha v1.0.6_01' | 'Alpha v1.0.6' | 'Alpha v1.0.5_01' | 'Alpha v1.0.5' | 'Classic server 1.10.1' | 'Classic server 1.10' | 'Classic 0.30' | 'Classic 0.29_02' | 'Classic 0.29_01' | 'Classic 0.29' | 'Classic 0.28_01' | 'Classic server 1.9' | 'Classic server 1.8.3' | 'Classic 0.27 SURVIVAL TEST' | 'Classic 0.26 SURVIVAL TEST' | 'Classic 0.25_05 SURVIVAL TEST' | 'Classic 0.25 SURVIVAL TEST' | 'Classic 0.24_SURVIVAL_TEST_03' | 'Classic 0.24_SURVIVAL_TEST_02' | 'Classic 0.24_SURVIVAL_TEST_01' | 'Classic 0.24_SURVIVAL_TEST' | 'Classic 0.0.23a_01' | 'Classic 0.0.23a' | 'Classic 0.0.22a_05' | 'Classic 0.0.22a_04' | 'Classic 0.0.22a_03' | 'Classic 0.0.22a_02' | 'Classic 0.0.22a_01' | 'Classic 0.0.22a' | 'Classic 0.0.21a_01' | 'Classic 0.0.21a' | 'Classic 0.0.20a_02' | 'Classic server 1.8.2' | 'Classic 0.0.20a_01' | 'Classic server 1.8.1' | 'Classic server 1.8' | 'Classic server 1.7' | 'Classic server 1.6' | 'Classic server 1.5' | 'Classic 0.0.18a_02' | 'Classic server 1.4.1' | 'Classic server 1.4' | 'Classic server 1.3' | 'Classic 0.0.17a' | 'Classic server 1.2' | 'Classic 0.0.16a_02';
type newVersion = '22w19a' | '22w18a' | '22w17a' | '22w16b' | '22w16a' | '22w15a' | '22w14a' | '22w13a' | '22w12a' | '22w11a' | 'Deep Dark Experimental Snapshot 1' | '1.18.2' | '1.18.2 Release Candidate 1' | '1.18.2 Pre-release 3' | '1.18.2 Pre-release 2' | '1.18.2 Pre-release 1' | '22w07a' | '22w06a' | '22w05a' | '22w03a' | '1.18.1' | '1.18.1 Release Candidate 3' | '1.18.1 Release Candidate 2' | '1.18.1 Release Candidate 1' | '1.18.1 Pre-release 1' | '1.18' | '1.18 Release Candidate 4' | '1.18 Release Candidate 3' | '1.18 Release Candidate 2' | '1.18 Release Candidate 1' | '1.18 Pre-release 8' | '1.18 Pre-release 7' | '1.18 Pre-release 6' | '1.18 Pre-release 5' | '1.18 Pre-release 4' | '1.18 Pre-release 3' | '1.18 Pre-release 2' | '1.18 Pre-release 1' | '21w44a' | '21w43a' | '21w42a' | '21w41a' | '21w40a' | '21w39a' | '21w38a' | '21w37a' | '1.18 experimental snapshot 7' | '1.18 experimental snapshot 6' | '1.18 experimental snapshot 5' | '1.18 experimental snapshot 4' | '1.18 experimental snapshot 3' | '1.18 experimental snapshot 2' | '1.18 Experimental Snapshot 1' | '1.17.1' | '1.17.1 Release Candidate 2' | '1.17.1 Release Candidate 1' | '1.17.1 Pre-release 3' | '1.17.1 Pre-release 2' | '1.17.1 Pre-release 1' | '1.17' | '1.17 Release Candidate 2' | '1.17 Release Candidate 1' | '1.17 Pre-release 5' | '1.17 Pre-release 4' | '1.17 Pre-release 3' | '1.17 Pre-release 2' | '1.17 Pre-release 1' | '21w20a' | '21w19a' | '21w18a' | '21w17a' | '21w16a' | '21w15a' | '21w14a' | '21w13a' | '21w11a' | '21w10a' | '21w08b' | '21w08a' | '21w07a' | '21w06a' | '21w05b' | '21w05a' | '21w03a' | '20w51a' | '20w49a' | '20w48a' | '20w46a' | '20w45a' | 'Combat Test 8c' | 'Combat Test 7c' | 'Combat Test 6' | '1.16.5' | '1.16.5 Release Candidate 1' | '1.16.4' | '1.16.4 Release Candidate 1' | '1.16.4 Pre-release 2' | '1.16.4 Pre-release 1' | '1.16.3' | '1.16.3 Release Candidate 1' | '1.16.2' | '1.16.2 Release Candidate 2' | '1.16.2 Release Candidate 1' | '1.16.2 Pre-release 3' | '1.16.2 Pre-release 2' | '1.16.2 Pre-release 1' | '20w30a' | '20w29a' | '20w28a' | '20w27a' | '1.16.1' | '1.16' | '1.16 Release Candidate 1' | '1.16 Pre-release 8' | '1.16 Pre-release 7' | '1.16 Pre-release 6' | '1.16 Pre-release 5' | '1.16 Pre-release 4' | '1.16 Pre-release 3' | '1.16 Pre-release 2' | '1.16 Pre-release 1' | '20w22a' | '20w21a' | '20w20b' | '20w20a' | '20w19a' | '20w18a' | '20w17a' | '20w16a' | '20w15a' | '20w14a' | '20w13b' | '20w13a' | '20w12a' | '20w11a' | '20w10a' | '20w09a' | '20w08a' | '20w07a' | 'Snapshot 20w06a' | 'Combat Test 5' | 'Combat Test 4' | '1.15.2' | '1.15.2 Pre-release 2' | '1.15.2 Pre-Release 1' | '1.15.1' | '1.15.1 Pre-release 1' | '1.15' | '1.15 Pre-release 7' | '1.15 Pre-release 6' | '1.15 Pre-release 5' | '1.15 Pre-release 4' | '1.15 Pre-release 3' | '1.15 Pre-Release 2' | '1.15 Pre-release 1' | '19w46b' | '19w46a' | '19w45b' | '19w45a' | '19w44a' | '19w42a' | '19w41a' | '19w40a' | '19w39a' | '19w38b' | '19w38a' | '19w37a' | '19w36a' | '19w35a' | '19w34a' | 'Combat Test 3' | 'Combat Test 2' | '1.14.3 - Combat Test' | '1.14.4' | '1.14.4 Pre-Release 7' | '1.14.4 Pre-Release 6' | '1.14.4 Pre-Release 5' | '1.14.4 Pre-Release 4' | '1.14.4 Pre-Release 3' | '1.14.4 Pre-Release 2' | '1.14.4 Pre-Release 1' | '1.14.3' | '1.14.3 Pre-Release 4' | '1.14.3 Pre-Release 3' | '1.14.3 Pre-Release 2' | '1.14.3 Pre-Release 1' | '1.14.2' | '1.14.2 Pre-Release 4' | '1.14.2 Pre-Release 3' | '1.14.2 Pre-Release 2' | '1.14.2 Pre-Release 1' | '1.14.1' | '1.14.1 Pre-Release 2' | '1.14.1 Pre-Release 1' | '1.14' | '1.14 Pre-Release 5' | '1.14 Pre-Release 4' | '1.14 Pre-Release 3' | '1.14 Pre-Release 2' | '1.14 Pre-Release 1' | '19w14b' | '19w14a' | '19w13b' | '19w13a' | '19w12b' | '19w12a' | '19w11b' | '19w11a' | '19w09a' | '19w08b' | '19w08a' | '19w07a' | '19w06a' | '19w05a' | '19w04b' | '19w04a' | '19w03c' | '19w03b' | '19w03a' | '19w02a' | '18w50a' | '18w49a' | '18w48b' | '18w48a' | '18w47b' | '18w47a' | '18w46a' | '18w45a' | '18w44a' | '18w43c' | '18w43b' | '18w43a' | '1.13.2' | '1.13.2-pre2' | '1.13.2-pre1' | '1.13.1' | '1.13.1-pre2' | '1.13.1-pre1' | '18w33a' | '18w32a' | '18w31a' | '18w30b' | '18w30a' | '1.13' | '1.13-pre10' | '1.13-pre9' | '1.13-pre8' | '1.13-pre7' | '1.13-pre6' | '1.13-pre5' | '1.13-pre4' | '1.13-pre3' | '1.13-pre2' | '1.13-pre1' | '18w22c' | '18w22b' | '18w22a' | '18w21b' | '18w21a' | '18w20c' | '18w20b' | '18w20a' | '18w19b' | '18w19a' | '18w16a' | '18w15a' | '18w14b' | '18w14a' | '18w11a' | '18w10d' | '18w10c' | '18w10b' | '18w10a' | '18w09a' | '18w08b' | '18w08a' | '18w07c' | '18w07b' | '18w07a' | '18w06a' | '18w05a' | '18w03b' | '18w03a' | '18w02a' | '18w01a' | '17w50a' | '17w49b' | '17w49a' | '17w48a' | '17w47b' | '17w47a' | '17w46a' | '17w45b' | '17w45a' | '17w43b' | '17w43a' | '1.12.2' | '1.12.2-pre2' | '1.12.1' | '1.12.1-pre1' | '17w31a' | '1.12' | '1.12-pre7' | '1.12-pre6' | '1.12-pre5' | '1.12-pre4' | '1.12-pre3' | '1.12-pre2' | '1.12-pre1' | '17w18b' | '17w18a' | '17w17b' | '17w17a' | '17w16b' | '17w16a' | '17w15a' | '17w14a' | '17w13b' | '17w13a' | '17w06a' | '1.11.2' | '1.11' | '1.11-pre1' | '16w44a' | '16w42a' | '16w41a' | '16w40a' | '16w39c' | '16w39b' | '16w39a' | '16w38a' | '16w36a' | '16w35a' | '16w33a' | '16w32b' | '16w32a' | '1.10.2' | '1.10-pre2' | '1.10-pre1' | '16w21b' | '16w21a' | '16w20a' | '1.9.4' | '1.9.3-pre1' | '1.9.1' | '1.9.1-pre1' | '1.9-pre4' | '1.9-pre3' | '1.9-pre2' | '1.9-pre1' | '16w07b' | '16w07a' | '16w06a' | '16w05b' | '16w05a' | '16w04a' | '16w03a' | '16w02a' | '15w51b' | '15w51a' | '15w50a' | '15w49b' | '15w49a' | '15w47c' | '15w47b' | '15w47a' | '15w46a' | '15w45a' | '15w44b' | '15w44a' | '15w43c' | '15w43b' | '15w43a' | '15w42a' | '15w41b' | '15w41a' | '15w40b' | '15w40a' | '15w39c' | '15w38b' | '15w38a' | '15w37a' | '15w36d' | '15w36c' | '15w36b' | '15w36a' | '15w35e' | '15w35d' | '15w35c' | '15w35b' | '15w35a' | '15w34d' | '15w34c' | '15w34b' | '15w34a' | '15w33c' | '15w33b' | '15w33a' | '15w32c' | '15w32b' | '15w32a' | '15w31c' | '15w31b' | '15w31a' | '1.8.9' | '1.8-pre3' | '1.8-pre2' | '1.8-pre1' | '14w34d' | '14w34c' | '14w34b' | '14w34a' | '14w33c' | '14w33b' | '14w33a' | '14w32d' | '14w32c' | '14w32b' | '14w32a' | '14w31a' | '14w30c' | '14w30b' | '14w29b' | '14w28b' | '14w28a' | '14w27b' | '14w26c' | '14w26b' | '14w26a' | '14w25b' | '14w25a' | '14w21b' | '14w21a' | '14w20b' | '14w19a' | '14w18b' | '14w17a' | '14w11b' | '14w10c' | '14w08a' | '14w07a' | '14w06b' | '14w05b' | '14w04b' | '14w04a' | '14w03b' | '14w02c' | '1.7.5' | '1.7.1' | '13w43a' | '13w42b' | '13w41b' | '13w41a';