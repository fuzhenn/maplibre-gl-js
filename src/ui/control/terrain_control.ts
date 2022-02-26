import DOM from '../../util/dom';
import {bindAll} from '../../util/util';

import type Map from '../map';
import type {IControl} from './control';

type TerrainOptions = {
    id?: string;
    options?: {exaggeration: number; elevationOffset: number};
};

/**
 * An `TerrainControl` control adds a button to turn terrain on and off.
 *
 * @implements {IControl}
 * @param {Object} [options]
 * @param {string} [options.id] The ID of the raster-dem source to use.
 * @param {exaggeration: number; elevationOffset: number} [options.options] Allowed options are exaggeration: number; elevationOffset: number
 * @example
 * var map = new maplibregl.Map({TerrainControl: false})
 *     .addControl(new maplibregl.TerrainControl({
 *         id: "terrain"
 *     }));
 */
class TerrainControl implements IControl {
    options: TerrainOptions;
    _map: Map;
    _container: HTMLElement;
    _terrainButton: HTMLButtonElement;

    constructor(options: TerrainOptions = {}) {
        this.options = options;

        bindAll([
            '_toggleTerrain',
            '_updateTerrainIcon',
        ], this);
    }

    onAdd(map: Map) {
        this._map = map;
        this._container = DOM.create('div', 'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group');
        this._terrainButton = DOM.create('button', 'maplibregl-ctrl-terrain mapboxgl-ctrl-terrain', this._container);
        DOM.create('span', 'maplibregl-ctrl-icon mapboxgl-ctrl-icon', this._terrainButton).setAttribute('aria-hidden', 'true');
        this._terrainButton.type = 'button';
        this._terrainButton.addEventListener('click', this._toggleTerrain);

        this._updateTerrainIcon();
        this._map.on('terrain', this._updateTerrainIcon);
        return this._container;
    }

    onRemove() {
        DOM.remove(this._container);
        this._map.off('terrain', this._updateTerrainIcon);
        this._map = undefined;
    }

    _toggleTerrain() {
        if (this._map.style.terrainSourceCache.isEnabled()) {
            this._map.removeTerrain();
        } else {
            this._map.addTerrain(this.options.id, this.options.options);
        }
        this._updateTerrainIcon();
    }

    _updateTerrainIcon() {
        this._terrainButton.classList.remove('maplibregl-ctrl-terrain', 'mapboxgl-ctrl-terrain');
        this._terrainButton.classList.remove('maplibregl-ctrl-terrain-enabled', 'mapboxgl-ctrl-terrain-enabled');
        if (this._map.isTerrainLoaded()) {
            this._terrainButton.classList.add('maplibregl-ctrl-terrain-enabled', 'mapboxgl-ctrl-terrain-enabled');
            this._terrainButton.title = this._map._getUIString('TerrainControl.disableTerrain');
        } else {
            this._terrainButton.classList.add('maplibregl-ctrl-terrain', 'mapboxgl-ctrl-terrain');
            this._terrainButton.title = this._map._getUIString('TerrainControl.enableTerrain');
        }
    }
}

export default TerrainControl;