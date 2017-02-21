import { MetaDatableClass } from './metadata';
import { AttributeConverter } from './converter';

export abstract class ResultSetModel {

    /**
     * Transform the given JSON in data to fill the resultset.
     * TODO: remove this code from constructor
     * TODO: separete this code into 'fill with data' and 'cast'
     */
    public constructor(resultSet: Object) {

        if (resultSet.constructor !== Object) {
            throw new Error('[ResultSetModel class] the resultSet argument must be a JSON object.');
        }

        const metaData: MetaDatableClass = <MetaDatableClass> <Object> (<Object> this).constructor;
        const ourMap: Map<string, AttributeConverter<any, any>> = metaData.__att_converter_metadata__;

        Object.keys(this).forEach((attr: string) => {
            const attributeConverter: AttributeConverter<any, any> = ourMap.get(attr);
            const resultSetHasProperty: boolean = resultSet.hasOwnProperty(attr);
            const propertyHasDefaultValue: boolean = this[attr] !== undefined; // change to 'this.prototype[attr]'

            if (attributeConverter) {
                this[attr] = attributeConverter.toApplication(resultSet[attr]);
            } else if (!(!resultSetHasProperty && propertyHasDefaultValue)) {
                this[attr] = resultSet[attr];
            }
        });
    }

    /**
     * Generate a JSON based on this class
     */
    public toJson(): Object {
        const json: Object          = new Object();
        const str: Array<string>    = Array<string>();

        Object.keys(this).forEach((attr: string) => {
            const isFunction    = (Object(this[attr]).constructor === Function);
            const isBaseModel   = (this instanceof ResultSetModel);
            const isObject      = (this instanceof Object);

            if (isBaseModel) {
                const baseModel = <ResultSetModel>this[attr];
                json[attr]      = baseModel.toJson();
            } else if (isObject) {
                //   TODO
            } else if (!isFunction) {
                json[attr] = this[attr];
            }
        });

        return json;
    }

    /**
     * Transform this class in a JSON string
     */
    public toString(): string {
        return JSON.stringify(this.toJson());
    }
}

