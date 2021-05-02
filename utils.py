def build_series_pair(df, attribute, settings):
    helper_series =(df[attribute] >= settings[attribute][0]) & (df[attribute] <= settings[attribute][1]) # calculate pair
    return helper_series