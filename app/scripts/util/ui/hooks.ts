import { AppSettings, AppSettingsFieldName } from 'models/app-settings';
import { useEffect, useState } from 'preact/hooks';
import { NonFunctionPropertyNames } from 'util/types';
import { ListenerSignature, Model } from 'util/model';

export function useModelField<
    ModelEventsType extends ListenerSignature<ModelEventsType>,
    ModelType extends Model<ModelEventsType>,
    Field extends NonFunctionPropertyNames<ModelType>
>(model: ModelType, field: Field): ModelType[Field] {
    const [value, setValue] = useState(model[field]);

    useEffect(() => {
        model.onChange(field, setValue);
        return () => model.offChange(field, setValue);
    }, [model, field]);

    return value;
}

export function useAppSetting<Field extends AppSettingsFieldName>(
    field: Field
): typeof AppSettings[Field] {
    return useModelField(AppSettings, field);
}

export function useModelWatcher<
    ModelEventsType extends ListenerSignature<ModelEventsType>,
    ModelType extends Model<ModelEventsType>
>(model: ModelType): void {
    const [, setState] = useState({});

    useEffect(() => {
        const refresh = () => setState({});
        (model as Model).on('change', refresh);
        return () => (model as Model).off('change', refresh);
    }, [model]);
}
