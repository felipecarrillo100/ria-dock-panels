import {type CreateHSPCTilesModelOptions, HSPCTilesModel} from '@luciad/ria/model/tileset/HSPCTilesModel.js';
import {OGC3DTilesModel} from '@luciad/ria/model/tileset/OGC3DTilesModel.js';
import {WMSTileSetModel} from '@luciad/ria/model/tileset/WMSTileSetModel.js';
import {BingMapsTileSetModel} from '@luciad/ria/model/tileset/BingMapsTileSetModel.js';
import type {WMSCapabilitiesLayerConfig} from "@luciad/ria/model/image/WMSImageModel.js";

export class ModelFactory {

  public static createWMSModel(wmsSettings: {url: string, layers:  WMSCapabilitiesLayerConfig[]}) {
    return new Promise<WMSTileSetModel>((resolve, reject) => {
      // Adds a WMS layer as a background
      WMSTileSetModel.createFromURL(wmsSettings.url, wmsSettings.layers, {}).then(async (model: WMSTileSetModel) => {
        resolve(model);
      }).catch(()=>{
        reject();
      });
    });
  }

  public static createOgc3DTilesModel(OGC3DTilesSettings: any) {
    return new Promise<OGC3DTilesModel>((resolve, reject) => {
      OGC3DTilesModel.create(OGC3DTilesSettings.url, OGC3DTilesSettings).then(
        (model) => {
          if (model && model.modelDescriptor && model.modelDescriptor.type === 'OGC3D') {
            resolve(model);
          } else {
            reject(null);
          }
        },
        () => {
          reject();
        },
      );
    });
  }

  static async createHSPCModel(modelOptions: any) {
    return new Promise<HSPCTilesModel>((resolve, reject) => {
      HSPCTilesModel.create(modelOptions.url, modelOptions as CreateHSPCTilesModelOptions)
        .then((model) => {
          if (model && model.modelDescriptor && model.modelDescriptor.type === 'HSPC') {
            resolve(model);
          } else {
            reject(null);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  public static createBingmapsModel(command: any) {
    return new Promise<BingMapsTileSetModel>((resolve, reject) => {
      let options = { ...command };
      if (typeof options === 'undefined') {
        options = {
          imagerySet: '',
          token: '',
        };
      }
      let requestStr =
        `https://dev.virtualearth.net/REST/v1/Imagery/Metadata/${options.imagerySet}?key=${options.token}&include=ImageryProviders`;
      if (options.useproxy) {
        const proxyURL = 'Enter Bingmaps proxy here';
        requestStr = proxyURL;
      }

      ModelFactory.GET_JSON(requestStr).then(
        (response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              let resource;
              if (data.resourceSets[0] && data.resourceSets[0].resources[0]) {
                resource = data.resourceSets[0].resources[0];
                // Serve tiles over https://
                if (resource.imageUrl.indexOf('http://ecn.') > -1) {
                  resource.imageUrl = resource.imageUrl.replace('http:', 'https:');
                }
                if (resource.imageUrl.indexOf('http://ak.dynamic.') > -1) {
                  resource.imageUrl = resource.imageUrl.replace('{subdomain}.', '');
                  resource.imageUrl = resource.imageUrl.replace('http://', 'https://{subdomain}.ssl.');
                }
                resource.brandLogoUri = data.brandLogoUri;
              } else {
                resource = data;
              }
              const model = new BingMapsTileSetModel(resource);
              resolve(model);
            });
          } else {
            const reason = {
              type: 'error',
              message: 'Failed to create layer. Bing Maps service unreachable',
            };
            reject(reason);
          }
        },
        () => {
          const reason = { type: 'error', message: 'Failed to create layer. Bing Maps service unreachable' };
          reject(reason);
        },
      );
    });
  }
  private static GET_JSON(url: string) {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    } as any;
    return fetch(url, requestOptions);
  }

}
