import React from 'react';
import classname from 'classname'
const TextFieldGroup = ({
    type,
    name,
    placeholder,
    label,
    errors,
    info,
    setValue,
    disable,
    value,
    required
}) => {
    return (
             <div className="form-group">
                  <input type={type} className={classname("form-control form-control-lg",{
                    "is-invalid":errors ? errors[name] : false
                  })} 
                  placeholder={placeholder} name={name} 
                  value={value}
                  onChange={e=>setValue(e.target.value)}
                  required={required?true:false}
                  disabled={disable}
                  />
                  {
                  errors ? errors[name] : false && 
                  <div className="invalid-feedback">
                    {errors[name]}
                  </div>
                  }
                  {
                      info && <small className="form-text text-muted">{info}</small>
                  }
            </div>
    )
}

export default TextFieldGroup;
