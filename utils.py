def build_series_pair(df, attribute, settings):
    helper_series =(df[attribute] >= settings[attribute][0]) & (df[attribute] <= settings[attribute][1]) # calculate pair
    return helper_series


def populate_helper_db():
    """1) load data"""
    # grab current path
    path_new = os.path.dirname(__file__)

    # file names
    file_names = [
        '2018-19__match_infos_with_grades_and_summary_translated_cleaned.csv',
        '2019-20__match_infos_with_grades_and_summary_translated_cleaned.csv']

    all_dfs_from_csv = []

    # load
    for name in file_names:
        url = os.path.join(path_new, "static\data", name)
        all_dfs_from_csv.append(pd.read_csv(url))

    df_final = pd.concat(all_dfs_from_csv, axis=0, ignore_index=True)

    # clean data
    df_final = df_final[df_final['interview_home_english'] != 'NOTFOUND']
    df_final['interview_home_english'] = df_final['interview_home_english'].apply(lambda x: x.lower())
    df_final['interview_away_english'] = df_final['interview_away_english'].apply(lambda x: x.lower())

    last_ten_df = df_final.head(10)

    df_dict = filtered_df.to_dict('records')

    db_all_predicted_matches = df_dict