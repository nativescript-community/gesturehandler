//
//  RootViewGestureRecognizer.h
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "GestureHandler.h"

@interface RootViewGestureRecognizer : UIGestureRecognizer

@property (nullable, nonatomic, weak) id<RootViewGestureRecognizerDelegate> delegate;

- (void)blockOtherRecognizers;

@end
