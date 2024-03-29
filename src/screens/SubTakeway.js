import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, ScrollView, TextInput, SliderComponent } from 'react-native';
import MainDashborad from './Dinning';
import Burger from './Burger';
import Pay from './Pay';
import Takeway from './Takeway';
import RNPrint from 'react-native-print';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

var tableNames = "";
var tableIds = "";

const SubTakeway = (props) => {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const [state, setState] = useState('sub');
    const [loading, setLoading] = useState(false);
    const [select, setSelect] = useState('Burger');
    const [i, setI] = useState(1);
    const [p, setP] = useState(0);
    const [d, setD] = useState(0);
    const [value, setValue] = useState('1');
    const [data, setData] = useState();
    const [cat_id, setCat_id] = useState(0);
    const [slip, setSlip] = useState('');
    const [di, setDi] = useState(0);
    const or_Id = props.orID;
    const navigation = useNavigation();
    const [array, setArray] = useState([]);
    const [order, setOrder] = useState();
    const [cat, setCat] = useState();
    const count = props.Count;
    const table_id = props.Table_Id;
    const br = props.br;
    const [currentTime, setCurrentTime] = useState('');
    var svc = 0;
    var gst = 0;
    const Id = props.userId;
    var Total = p - d + svc + gst;

    const mapAndJoin = (arr, key) => {
        return arr.map(function (o) {
            return o[key];
        }).join();
    }

    useEffect(() => {
        if (props.mergedTables) {
            const mergedTables = props.mergedTables;

            tableNames = mapAndJoin(mergedTables, 'table');
            tableIds = mapAndJoin(mergedTables, 'key');
            console.log("tableIds ===", tableIds);
        }
    }, []);

    const reload = () => {
        setLoading(!loading)
    }


    const addNewItem = (name, price, Dis, id, Var) => {


        const obj = { 'key': i, 'item': name, 'p': price, 'dis': Dis, 'qty': 1, "id": id, 'var_id': Var };
        setP(p + parseInt(price));
        setD(d + parseInt(Dis))
        array.push(obj)
        reload();
        setI(i + 1);
        setData(array);
        setDi(Dis);
    };
    const newArray = (Id, pr, Dis) => {

        let index = array.indexOf(item => item.key == Id)
        array.splice(index, 0);

        setArray(array.filter(item => item.key != Id));

        setP(p - pr);
        setD(d - parseInt(Dis));

    }



    const Empty = () => {
        Total = 0;
        setP(0);
        svc = 0;
        gst = 0;
        setD(0);
        setArray([]);
        setLoading(!loading);
        setSelect('Burger');
    }

    // const Empty1 = () => {

    //     setArray(array.splice(0, array.length));
    //     setLoading(!loading)
    // }
    const token = '$2y$10$f43enwo0NWLsBmlGfx/ZMevMgmvEdbrZ3JTF.FNoVM4Nrj2aZYE82';


    useEffect(() => {
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes

        setCurrentTime(
            hours + ':' + min
        );

        setArray(array);
        fetch("http://warly2.sapphost.com/public/api/print", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                'Data': data,
                'Total': Total,
                'Dis': d,
            })
        }).
            then(res => res.json()).
            then(response => {
                setSlip(response);
            }).
            catch((error) => {
                console.error(error);
            });


        fetch('http://warly2.sapphost.com/public/api/cat?token=$2y$10$f43enwo0NWLsBmlGfx/ZMevMgmvEdbrZ3JTF.FNoVM4Nrj2aZYE82')
            .then((response) => response.json())
            .then((json) => setCat(json))
            .catch((error) => console.error(error));



    }, [loading]);

    const callback = () => {
        setSelect('Burger');
    };

    // const slip = <h1>hello</h1>

    // const print = async printHTML => {
    //     await RNPrint.print({
    //         html: '{slip}'
    //     })
    // }

    // // const print = async printPDF => {
    //     const results = await RNHTMLtoPDF.convert({
    //         html: '<View><Text>Hello</Text></View>',
    //         fileName: 'test',
    //         base64: true,
    //     })

    //     await RNPrint.print({ filePath: results.filePath })
    // }

    const print = async printRemotePDF => {
        await RNPrint.print({ filePath: slip.url })
    }



    const concatinate = (v) => {
        let localArr = [...array];

        let localQuantity = localArr[selectedIndex].qty;
        let localSubtotal = p - (localQuantity * parseInt(localArr[selectedIndex].p));

        if (v == 'del') {
            localQuantity = localQuantity.slice(0, -1);

            let rowPrice = parseInt(localArr[selectedIndex].p) * localQuantity;
            setP(localSubtotal + rowPrice);
        }
        else {
            localQuantity = localQuantity + v;

            let rowPrice = parseInt(localArr[selectedIndex].p) * localQuantity;
            setP(localSubtotal + rowPrice);
        }

        localArr[selectedIndex].qty = localQuantity;
        setValue(localQuantity);
        setArray(localArr);
    }


    const Save_Order = () => {
        fetch("https://warly2.sapphost.com/public/api/order_saved", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                'Token': token,
                'total': Total,
                'loc_id': br,
                'Data': data,
                'stf_id': props.userId,


            })
        }).
            then(res => res.json()).
            then(json => {
                setOrder(json);

            }).
            catch((error) => {
                console.error(error);
            });


    };


    // const Save_Table_order = () => {
    //     fetch("https://warly2.sapphost.com/api/table_res", {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json'
    //         },

    //         body: JSON.stringify({

    //             'Token': token,
    //             'total': Total,
    //             'loc_id': br,
    //             'Data': data,
    //             't_id': table_id,
    //             'mem': count,
    //             'stf_id': props.userId
    //         })
    //     }).
    //         then(res => res.json()).
    //         then(json => setTable_data(json)).
    //         catch((error) => {
    //             console.error(error);
    //         });
    // };

    const fun = () => {
        fetch("https://warly2.sapphost.com/public/api/table_res", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                'Token': token,
                'total': Total,
                'loc_id': br,
                'Data': data,
                't_id': tableIds,
                'mem': count,
                'stf_id': props.userId,

            })
        }).
            then(res => res.json()).
            then(json => {
                console.log(json);
            }).
            catch((error) => {
                console.error(error);
            });
    }

    const renderTakeAwayItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                <View style={styles.viewStyle}>
                    <Text style={styles.textStyle}>{item.key}</Text>
                </View>
                <View style={styles.viewStyle}>
                    <Text style={styles.textStyle}>{item.item}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.viewStyle, { borderWidth: 0.5 }]}
                    onPress={() => {
                        setSelect('cash');
                        setSelectedIndex(index);
                    }}>
                    <Text style={styles.textStyle}>{item.qty}</Text>
                </TouchableOpacity>

                {/* <View style={[styles.viewStyle, { borderWidth: 0.5 }]}>
                                                        <TextInput
                                                            onChangeText={(text) => item.qty = text}
                                                            value={item.qty}
                                                        />
                                                    </View> */}


                <View style={styles.viewStyle}>
                    <Text style={styles.textStyle}>{item.dis}</Text>
                </View>

                <View style={styles.viewStyle}>
                    <Text style={styles.textStyle}>${item.p}</Text>
                </View>
                <TouchableOpacity style={styles.viewbtnStyle}
                    onPress={() => newArray(item.key, item.p, item.dis)}>
                    <Image source={require('../assets/dele.jpg')} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>

            </View>
        );
    };

    // <Pay pay={Total} branch={br} D={data} userid={props.userId} t_id={table_id} member={count} reload={reload} addNewItem={addNewItem} Empty={Empty}  Call={callback} function={fun} statename={props.pass} />
    return (
        <>
            {state === 'sub' ?
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 0.5, backgroundColor: 'white' }}>
                        {props.Pass == 'table' ?
                            <>
                                <View style={{ flexDirection: 'row', }}>
                                    <TouchableOpacity
                                        style={{
                                            borderRadius: 5,
                                            borderWidth: 2,
                                            borderColor: "#b5b5b5",
                                            marginTop: 5,
                                            width: wp('15%'),
                                            alignItems: 'center',
                                            height: hp('7%'),
                                            flex: 1,
                                            alignSelf: 'flex-start',
                                            marginRight: 10,
                                            marginLeft: 5,
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => {
                                            setState(props.pass);

                                        }} >
                                        <Text style={{ padding: 2, fontSize: wp('1.5%'), alignSelf: 'center' }}>Back</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            borderRadius: 5,
                                            marginTop: 5,
                                            width: wp('30%'),
                                            alignItems: 'center',
                                            height: hp('7%'),
                                            backgroundColor: 'red',
                                            alignSelf: 'flex-end',
                                            justifyContent: 'center'

                                        }} >
                                        <Text style={{ padding: 2, fontSize: wp('1.5%'), color: 'white', alignSelf: 'center' }}>{tableNames}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{
                                    flexDirection: 'row', height: hp('5%'), borderColor: '#cbcdad', marginTop: 10, shadowColor: "#000",
                                    shadowOffset: {
                                        width: 10,
                                        height: 10
                                    },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 1,
                                    elevation: 1
                                }}>
                                    <Text style={{ alignSelf: 'flex-start', flex: 1, fontWeight: 'bold', fontSize: wp('1.3%'), marginTop: 4, marginLeft: 4 }}>
                                        TAKEWAY
                                </Text>
                                    <Text style={{ alignItems: 'center', flex: 1, color: 'red', fontSize: wp('1%'), marginTop: 4 }}>
                                        RECEIVED {currentTime}
                                    </Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: wp('1.3%'), marginTop: 4, marginRight: 4 }}>
                                        N0. 001
                                </Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginLeft: 0 }}>
                                    <View style={styles.viewStyle}>
                                        <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>NO.  </Text>
                                    </View>
                                    <View style={styles.viewStyle}>
                                        <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>item  </Text>
                                    </View>

                                    <View style={styles.viewStyle}>
                                        <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>Qty </Text>
                                    </View>

                                    <View style={styles.viewStyle}>
                                        <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>Discount</Text>
                                    </View>

                                    <View style={styles.viewStyle}>
                                        <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>Price  </Text>
                                    </View>
                                    <View style={styles.viewStyle}>
                                        <Text style={[styles.textStyle, { fontWeight: 'bold' }]}>Del   </Text>
                                    </View>
                                </View>

                                <View style={{ height: hp('40%') }}>
                                    <FlatList
                                        data={array}
                                        keyExtractor={(item) => item.key}
                                        renderItem={renderTakeAwayItem} />
                                </View>

                                <View style={{ flexDirection: 'row', flex: 1, }}>
                                    <View style={{ backgroundColor: 'rgb(240,240,240)', flex: 0.5, height: hp('26%'), }}>
                                    </View>

                                    <View style={{ backgroundColor: 'rgb(240,240,240)', flex: 0.5, borderLeftWidth: 0.4, alignContent: 'center', height: hp('26%') }}>
                                        <View style={{ opacity: 0.5, marginLeft: 25, marginRight: 25 }}>

                                            <View style={styles.vStyle}>
                                                <Text style={[styles.Tstyle, { flex: 1 }]}>Sub Total</Text>
                                                <Text style={styles.Tstyle}>${p}</Text>
                                            </View>

                                            <View style={styles.vStyle}>
                                                <Text style={[styles.Tstyle, { flex: 1 }]}>SVC Charge</Text>
                                                <Text style={styles.Tstyle}>${svc}</Text>
                                            </View>

                                            <View style={styles.vStyle}>
                                                <Text style={[styles.Tstyle, { flex: 1 }]}>GST</Text>
                                                <Text style={styles.Tstyle}>${gst}</Text>
                                            </View>

                                            <View style={styles.vStyle}>
                                                <Text style={[styles.Tstyle, { flex: 1 }]}>Discount</Text>
                                                <Text style={styles.Tstyle}>-${d}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderTopWidth: 1, marginLeft: 25, marginRight: 25, marginTop: '-4%' }}>
                                            <Text style={{ flex: 1, alignSelf: "center", fontSize: wp('1.5%') }} >Total</Text>
                                            <Text style={{ fontSize: wp('1.5%'), alignSelf: 'center' }}>${Total}</Text>
                                        </View>

                                    </View>
                                </View>
                            </>
                            : null

                        }

                        <View style={{ flexDirection: 'row', marginBottom: '3%', }}>
                            <View style={{ flex: 1, marginLeft: 10, }}>
                                <TouchableOpacity style={[styles.fbtnStyle, { alignSelf: 'flex-start' }]} onPress={() => {
                                    Empty();

                                }}>
                                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: wp('1.5%'), alignSelf: 'center', fontWeight: 'bold' }}>Void</Text>
                                </TouchableOpacity>
                            </View>
                            {props.pass == 'Takeway' ?

                                <View style={{ flex: 1, marginLeft: 10, }}>
                                    <TouchableOpacity style={{ alignSelf: 'center', width: wp('18%'), height: hp('6%'), borderWidth: 1, borderRadius: 3, justifyContent: 'center', marginLeft: wp('-5%') }} onPress={() => {
                                        print();
                                        Save_Order();
                                    }}>
                                        <Text style={{ alignSelf: 'center', fontSize: wp('1.5%'), marginTop: '2%', fontWeight: 'bold', alignSelf: 'center' }}>PRINT & SAVE TICKET </Text>
                                    </TouchableOpacity>
                                </View>
                                : props.pass == "Main" ? <>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <TouchableOpacity style={{ alignSelf: 'center', width: wp('18%'), height: hp('6%'), borderWidth: 1, borderRadius: 3, justifyContent: "center", marginLeft: wp('-5%') }} onPress={() => {
                                            print();
                                            fun();
                                            Empty();
                                        }}>
                                            <Text style={{ alignSelf: 'center', fontSize: wp('1.5%'), alignSelf: 'center', fontWeight: 'bold' }}>PRINT & SAVE TICKET </Text>
                                        </TouchableOpacity>
                                    </View>
                                </> : null}
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <TouchableOpacity
                                    style={{ alignSelf: 'center', width: wp('15%'), height: hp('6%'), borderWidth: 1, borderRadius: 3, justifyContent: "center", backgroundColor: 'red' }}
                                    onPress={() => {
                                        setSelect("Pay");
                                    }}>
                                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: wp('1.5%'), alignSelf: 'center', fontWeight: 'bold' }}>Pay </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 0.1, backgroundColor: 'rgb(240,240,240)', }}>

                        <FlatList
                            data={cat}
                            keyExtractor={item => item.key}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        style={[styles.Card, { backgroundColor: item.color }]}
                                        onPress={() => {
                                            setCat_id(item.id)
                                        }}>
                                        <Text style={styles.CardText}>{item.name}</Text>
                                    </TouchableOpacity>)
                            }}

                        />
                    </View>

                    {/* <View style={{ flex: 0.1, backgroundColor: 'rgb(240,240,240)' }}>

                                <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                    <TouchableOpacity style={[styles.Card, { backgroundColor: 'red' }]} onPress={() => setSelect('promo')}>

                                        <Text style={styles.CardText}>Promo</Text>


                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.Card, { backgroundColor: '#ffbf00' }]} onPress={() => setSelect('reward')}>

                                        <Text style={styles.CardText}>Rewards</Text>


                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.Card, { backgroundColor: 'gray' }]} onPress={() => setSelect('burger')}>

                                        <Text style={styles.CardText}>Burgers</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.Card, { backgroundColor: 'blue' }]} onPress={() => setSelect('side')}>

                                        <Text style={styles.CardText}>Sides</Text>


                                    </TouchableOpacity>

                                </View>

                            </View> */}






                    <View style={{ flex: 0.5, backgroundColor: 'white' }}>

                        {select === 'Burger' ? <Burger reload={reload} addNewItem={addNewItem} branch={br} Cat_id={cat_id} /> : select === 'Pay' ? <Pay pay={Total} branch={br} D={data} userid={props.userId} t_id={table_id} member={count} reload={reload} addNewItem={addNewItem} Empty={Empty} Call={callback} function={fun} statename={props.pass} Cat_id={cat_id} /> : select == 'cash' ?

                            <>
                                <View style={{ borderBottomWidth: 0.4, height: 50, flexDirection: 'row', backgroundColor: 'rgb(240,240,240)' }}>
                                    <Text style={{ alignSelf: 'center', flex: 1, fontSize: wp('1.4%'), marginLeft: 30 }}>Changing Quantity</Text>

                                    <Text style={{ fontSize: wp('1.4 %'), alignSelf: 'center', marginRight: 20 }} onPress={() => setSelect('Burger')}>Back</Text>
                                </View>

                                <View style={{ backgroundColor: 'rgb(230,240,230)', height: 30, flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={{ color: 'black' }}></Text>
                                    <Text style={{ fontSize: wp('1%') }}>{value}</Text>
                                </View>




                                <ScrollView>
                                    <Animatable.View
                                        animation="fadeInUpBig"
                                        duration={1500}
                                        style={{ height: '100%', marginTop: 10, alignSelf: 'center' }}
                                    >


                                        <View style={{ flexDirection: 'row', width: '98%', borderWidth: 1, backgroundColor: 'white' }}>

                                            <TouchableOpacity style={{ width: '33%', backgroundColor: 'white', height: 100, justifyContent: 'center', borderRightWidth: 1 }}
                                                onPress={() => concatinate('1')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>1</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ width: '34%', backgroundColor: 'white', height: 100, justifyContent: 'center', }}
                                                onPress={() => concatinate('2')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>2</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ width: '33%', backgroundColor: 'white', height: 100, justifyContent: 'center', borderLeftWidth: 1 }}
                                                onPress={() => concatinate('3')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold', }}>3</Text>
                                            </TouchableOpacity>


                                        </View>



                                        <View style={{ flexDirection: 'row', width: '98%', borderWidth: 1, backgroundColor: 'white' }}>


                                            <TouchableOpacity style={{ width: '33%', backgroundColor: 'white', height: 100, justifyContent: 'center', borderRightWidth: 1, }}
                                                onPress={() => concatinate('4')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>4</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ width: '34%', backgroundColor: 'white', height: 100, justifyContent: 'center', }}
                                                onPress={() => concatinate('5')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>5</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ width: '33%', backgroundColor: 'white', height: 100, justifyContent: 'center', borderLeftWidth: 1 }}
                                                onPress={() => concatinate('6')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold', }}>6</Text>
                                            </TouchableOpacity>


                                        </View>



                                        <View style={{ flexDirection: 'row', width: '98%', borderWidth: 1, backgroundColor: 'white' }}>


                                            <TouchableOpacity style={{ width: '33%', backgroundColor: 'white', height: 100, justifyContent: 'center', borderRightWidth: 1 }}
                                                onPress={() => concatinate('7')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>7</Text>
                                            </TouchableOpacity>



                                            <TouchableOpacity style={{ width: '34%', backgroundColor: 'white', height: 100, justifyContent: 'center', }}
                                                onPress={() => concatinate('8')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>8</Text>
                                            </TouchableOpacity>



                                            <TouchableOpacity style={{ width: '33%', backgroundColor: 'white', height: 100, justifyContent: 'center', borderLeftWidth: 1 }}
                                                onPress={() => concatinate('9')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold', }}>9</Text>
                                            </TouchableOpacity>


                                        </View>



                                        <View style={{ flexDirection: 'row', width: '98%', backgroundColor: 'white', borderWidth: 1 }}>


                                            <TouchableOpacity style={{ width: '33%', backgroundColor: 'white', height: 100, justifyContent: 'center', borderRightWidth: 1 }}
                                                onPress={() => concatinate('del')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>CLEAR</Text>
                                            </TouchableOpacity>



                                            <TouchableOpacity style={{ width: '34%', backgroundColor: 'white', height: 100, justifyContent: 'center', }}
                                                onPress={() => concatinate('0')}>
                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>0</Text>
                                            </TouchableOpacity>



                                            <TouchableOpacity style={{ width: '33%', backgroundColor: 'white', height: 100, justifyContent: 'center', borderLeftWidth: 1 }} onPress={() => concatinate('.')}>

                                                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold', }}>.</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity style={{ backgroundColor: 'red', height: hp('8%'), justifyContent: 'center', borderRadius: 4, width: wp('40%'), alignSelf: 'center', marginTop: 30, marginBottom: 5 }}
                                            onPress={() => setSelect('Burger')}
                                        >
                                            <Text style={{ color: 'white', alignSelf: 'center', fontSize: wp('2%') }}>Next</Text>
                                        </TouchableOpacity>

                                    </Animatable.View>
                                </ScrollView>


                            </> : null}

                    </View>









                </View> : state == 'Takeway' ?
                    <Takeway branch={br} idUser={props.userId} /> : state == 'Main' ? <MainDashborad br={br} Key={Id} /> : null
            }
        </>
    );
}

export default SubTakeway;

const styles = {
    textStyle: {
        fontSize: wp('1.3%'),
        alignSelf: 'center'
    },
    viewStyle: {

        marginTop: 5,
        borderRightWidth: 0.5,
        width: "17%"
    },
    viewbtnStyle: {
        marginLeft: '2%',
        marginTop: 5,
        width: wp('5%'),
        height: hp('5%'),
    },

    vStyle: {
        flexDirection: 'row',
        height: '21%'

    },
    Tstyle: {
        alignSelf: "center",
        fontSize: wp('1.3%')
    },
    fbtnStyle: {
        width: wp('7%'),
        height: hp('6%'),
        borderRadius: 3,
        backgroundColor: 'red',
        justifyContent: 'center'
    },
    Card: {
        width: wp('8.2%'),
        height: hp('18%'),
        marginTop: 10,
        marginLeft: 3,
        justifyContent: 'center',
        borderRadius: 4,

    },
    CardText: {
        alignSelf: 'center',

        color: 'white',
        fontWeight: 'bold',
        fontSize: wp('1.7%')
    },
    container: {
        flex: 1,
        backgroundColor: "#ffffff",

    },
    container1: {
        borderRadius: 10,
        alignSelf: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#b5b5b5",
        width: "60%",
        height: "80%",
        marginRight: 150,
        marginLeft: 150,
    },
    TextStyle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 20,
    },
    UserView: {
        borderRadius: 40,
        alignSelf: "center",
        justifyContent: "center",
        width: 75,
        height: 75,
        marginLeft: 10,
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    UserViewText: {
        color: "#ab8081",
        fontWeight: "bold",
        marginTop: 5,
        fontSize: 12,
    },

    NumberTextStyle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 25,
        alignSelf: "center",
    },

    PinView: {

        width: 25,
        height: 25,
        marginLeft: 5,
        borderWidth: 1,
        borderRadius: 25
    },
};
