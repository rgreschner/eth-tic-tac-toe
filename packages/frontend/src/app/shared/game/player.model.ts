/**
 * Domain model for player.
 */
export interface Player {
    /** Player Ethereum address. */
    address: string;
    /** Player number. */
    number: number;
    /** Icon classes for display. */
    iconClass?: string;
}