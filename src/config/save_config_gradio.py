from src.config._save_config import _save_config
from src.config.config import config
from typing import List, Any


def _convert_empty_strings_to_none(dictionary: dict):
    for key, value in dictionary.items():
        if value == '':
            dictionary[key] = None


def _recreate_ui_dict(keys: List[str], inputs: List[Any]):
    return {
        keys[i]: value for i, value in enumerate(inputs)
    }


def _save_config_gradio(keys: List[str], inputs: List[Any]):
    gradio_interface_options_ui = _recreate_ui_dict(keys, inputs)
    _convert_empty_strings_to_none(gradio_interface_options_ui)

    return gradio_interface_options_ui


def save_config_gradio(keys: List[str], inputs: List[Any]):
    global config
    config["gradio_interface_options"] = _save_config_gradio(keys, inputs)
    _save_config(config)

    return f"Saved {config['gradio_interface_options']}"
